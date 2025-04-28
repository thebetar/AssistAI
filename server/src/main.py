import json
import git
import os
from datetime import datetime
from typing import List
from fastapi import FastAPI, Form, UploadFile, File, Request
from fastapi.responses import (
    HTMLResponse,
    JSONResponse,
    PlainTextResponse,
)
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import hashlib
from urllib.parse import quote

from models.files import FilesDataModel
from models.tags import TagsDataModel

from model import (
    CustomDocumentChatModel,
    DATA_DIR,
    DATA_FILES_DIR,
)

DATA_FILES_SYNC_DIR = os.path.join(DATA_DIR, "github")

TAGS_FILE = os.path.join(DATA_FILES_DIR, "tags.json")
# Load the config.json file
CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config.json")

# Read the config file
with open(CONFIG_PATH, "r") as f:
    config = json.load(f)

app = FastAPI()

# Serve static files from the 'client/assets' directory at the '/assets' path
app.mount("/assets", StaticFiles(directory="client/assets"), name="assets")
templates = Jinja2Templates(directory="client")

assist_model = CustomDocumentChatModel(
    silent=False,
    refresh=False,
    chat_model=config.get("chat_model", None),
    embedding_model=config.get("embedding_model", None),
    temperature=config.get("temperature", 0.1),
)

tags_model = TagsDataModel(tags_file=TAGS_FILE)
files_model = FilesDataModel(files_dir=DATA_FILES_DIR, tags_model=tags_model)


def get_pending_status():
    # Check if pending documents
    last_document_change = getattr(assist_model, "last_document_change", None)
    last_updated = getattr(assist_model, "last_updated", None)

    if not last_document_change and not last_updated:
        return False

    if last_document_change and not last_updated:
        return True

    if last_document_change > last_updated:
        return True

    return False


@app.get("/api/pending", response_class=JSONResponse)
async def pending_status():
    pending = get_pending_status()
    return {"pending": pending}


@app.get("/api/history", response_class=JSONResponse)
async def get_history():
    # Get the chat history from the assist_model instance
    chat_history = getattr(assist_model, "history", None)

    if chat_history is None:
        return JSONResponse({"error": "No chat history available"}, status_code=404)

    # Return the chat history as JSON
    return {"history": chat_history}


@app.post("/api/question", response_class=JSONResponse)
async def ask_question(
    question: str = Form(""),
    use_rag: str = Form("off"),
    clear: str = Form("false"),
):
    use_rag_bool = use_rag == "on"
    clear_bool = clear == "true"

    response = assist_model.invoke(question, use_rag=use_rag_bool, clear=clear_bool)
    chat_history = getattr(assist_model, "history", None)

    return {
        "response": response,
        "question": question,
        "history": chat_history,
        "use_rag": use_rag_bool,
    }


# --- Document Management ---


def sync_with_github():
    print("Syncing with GitHub...")

    sync_directory = DATA_FILES_SYNC_DIR
    data_directory = DATA_FILES_DIR
    repository_url = config.get("github_url", None).replace("https://", "")
    access_token = config.get("github_access_token", None)

    if not os.path.exists(sync_directory):
        repo = git.Repo.clone_from(
            f"https://{quote(access_token)}:x-oauth-basic@{repository_url}",
            sync_directory,
        )
    else:
        repo = git.Repo(sync_directory)

    # Write all files from files dir to the sync dir
    for filename in os.listdir(data_directory):
        source_path = os.path.join(data_directory, filename)
        dest_path = os.path.join(sync_directory, filename)

        if os.path.isfile(source_path):
            with open(source_path, "rb") as src_file:
                with open(dest_path, "wb") as dest_file:
                    dest_file.write(src_file.read())

    repo.git.add(all=True)
    repo.index.commit("Sync with local changes")
    origin = repo.remote(name="origin")
    origin.push()


@app.get("/api/files", response_class=JSONResponse)
async def get_files():
    files = files_model.get_files()

    # Check if the correct config is set to sync
    if "github_url" in config and "github_access_token" in config:
        # Store checksum of files in config
        checksum = hashlib.sha256(json.dumps(files).encode("utf-8")).hexdigest()

        # Check if files updated since last load
        if "files_checksum" in config and config["files_checksum"] == checksum:
            with open(CONFIG_PATH, "w") as f:
                json.dump(config, f, indent=4)

            # Sync using github url if provided
            sync_with_github()

        config["files_checksum"] = checksum

    with open(CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=4)

    return {"files": files}


@app.post("/api/files", response_class=JSONResponse)
async def upload_note(filename: str = Form(...), content: str = Form(...)):
    files_model.add(filename=filename, content=content)

    # Update last document change time in state
    assist_model.last_document_change = datetime.now()

    # Optionally reload vector store if needed
    return {"success": True, "filename": filename}


@app.post("/api/files/upload", response_class=JSONResponse)
async def upload_file(files: List[UploadFile] = File(...)):
    for file in files:
        files_model.add_buffer(filename=file.filename, content_buffer=file.file)

    # Update last document change time in state
    assist_model.last_document_change = datetime.now()

    # Return updated file list as JSON
    updated_files = files_model.get_files()

    return {"files": updated_files}


@app.put("/api/files/{filename}", response_class=JSONResponse)
async def update_file(
    filename: str,
    content: str = Form(...),
):
    files_model.update(filename=filename, content=content)

    # Update last document change time in state
    assist_model.last_document_change = datetime.now()

    return {"success": True, "filename": filename}


@app.delete("/api/files/{filename}", response_class=JSONResponse)
async def delete_file(filename: str):
    # Remove file and tags
    files_model.delete(filename=filename)
    tags_model.remove_file(filename=filename)

    # Update last document change time in state
    assist_model.last_document_change = datetime.now()

    # Return updated file list as JSON
    updated_files = files_model.get_files()

    return {"files": updated_files}


@app.post("/api/files/reload", response_class=JSONResponse)
async def reload_model():
    # Reload the vector store based on the new documents
    assist_model.load_documents()
    assist_model.load_vector_store(force=True)

    # Update last updated in state
    assist_model.last_updated = datetime.now()

    # Return updated file list as JSON
    updated_files = files_model.get_files()

    return {"files": updated_files}


@app.get("/api/tags", response_class=JSONResponse)
async def get_all_tags():
    tags = tags_model.get_tags()

    return tags


@app.post("/api/tags/{item:path}", response_class=JSONResponse)
async def add_tag(item: str, tag: str = Form(...)):
    tags_model.add(filename=item, tag=tag)

    tags = tags_model.get_tags()

    return {"tags": tags}


@app.delete("/api/tags/{item:path}", response_class=JSONResponse)
async def remove_tag(item: str, tag: str = Form(...)):
    tags_model.remove_tag(filename=item, tag=tag)

    tags = tags_model.get_tags()

    return {"tags": tags}


# --- Settings Management ---


@app.get("/api/settings")
async def get_settings():
    if not os.path.exists(CONFIG_PATH):
        return {
            "chat_model": assist_model.chat_model,
            "embedding_model": assist_model.embedding_model,
            "temperature": assist_model.temperature,
            "github_url": "",
            "github_access_token": "",
        }
    with open(CONFIG_PATH, "r") as f:
        data = json.load(f)
        return data


@app.put("/api/settings", response_class=JSONResponse)
async def update_settings(
    chat_model: str = Form("gemma3:1b"),
    embedding_model: str = Form("gemma3:1b"),
    temperature: float = Form(0.1),
    github_url: str = Form(""),
    github_access_token: str = Form(""),
):
    assist_model.chat_model = chat_model
    assist_model.embedding_model = embedding_model
    assist_model.temperature = temperature

    assist_model.load_model()

    config["chat_model"] = chat_model
    config["embedding_model"] = embedding_model
    config["temperature"] = temperature
    config["github_url"] = github_url
    config["github_access_token"] = github_access_token

    with open(CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=4)

    return {
        "chat_model": chat_model,
        "embedding_model": embedding_model,
        "temperature": temperature,
        "github_url": github_url,
        "github_access_token": github_access_token,
    }


# Catch-all route for client-side routing (Solid.js)
@app.get("/{full_path:path}", response_class=HTMLResponse)
async def catch_all(request: Request, full_path: str):
    # Only serve index.html for non-API, non-assets paths
    if full_path.startswith("api/") or full_path.startswith("assets/"):
        return PlainTextResponse("Not Found", status_code=404)

    return templates.TemplateResponse("index.html", {"request": request})
