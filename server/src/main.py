import json
import os
import shutil
from datetime import datetime
from typing import List
from fastapi import FastAPI, Request, Form, UploadFile, File, Body
from fastapi.responses import (
    HTMLResponse,
    FileResponse,
    JSONResponse,
    PlainTextResponse,
)
from fastapi.staticfiles import StaticFiles
from fastapi.templating import Jinja2Templates
import hashlib
import requests
from bs4 import BeautifulSoup

from model import (
    CustomDocumentModel,
    DATA_DIR,
    DATA_FILES_DIR,
    DATA_URLS_DIR,
)

app = FastAPI()

# Serve static files from the 'client/assets' directory at the '/assets' path
app.mount("/assets", StaticFiles(directory="client/assets"), name="assets")
templates = Jinja2Templates(directory="client")

# Load the config.json file
CONFIG_PATH = os.path.join(os.path.dirname(__file__), "config.json")

# Read the config file
with open(CONFIG_PATH, "r") as f:
    config = json.load(f)

assist_model = CustomDocumentModel(
    silent=False,
    refresh=False,
    chat_model=config.get("chat_model", None),
    embedding_model=config.get("embedding_model", None),
    temperature=config.get("temperature", 0.1),
)

URLS_INDEX_PATH = os.path.join(DATA_URLS_DIR, "urls.json")
TAGS_PATH = os.path.join(DATA_DIR, "tags.json")


def get_pending_status():
    # Check if pending documents
    last_document_change = getattr(assist_model, "last_document_change", None)
    last_updated = getattr(assist_model, "last_updated", None)

    print(last_document_change, last_updated)

    if not last_document_change and not last_updated:
        return False

    if last_document_change and not last_updated:
        return True

    if last_document_change > last_updated:
        return True

    return False


def load_urls_index():
    if os.path.exists(URLS_INDEX_PATH):
        with open(URLS_INDEX_PATH, "r", encoding="utf-8") as f:
            return json.load(f)

    return []


def save_urls_index(urls):
    with open(URLS_INDEX_PATH, "w", encoding="utf-8") as f:
        json.dump(urls, f, indent=2)


def url_to_id(url):
    return hashlib.sha256(url.encode("utf-8")).hexdigest()


def url_txt_filename(url_id):
    return f"url_{url_id}.txt"


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
    request: Request,
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


def get_file_info(filename, data_dir=DATA_FILES_DIR):
    file_path = os.path.join(data_dir, filename)

    if not os.path.exists(file_path):
        return None

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    return {"name": filename, "content": content}


def populate_files(files, data_dir=DATA_FILES_DIR):
    tags = load_tags()

    populated_files = []

    for file in files:
        file_info = get_file_info(filename=file, data_dir=data_dir)

        if not file_info:
            continue

        # Get tags for the file
        file_tags = get_tags_for_item(file, tags)

        populated_files.append(
            {
                "name": file_info["name"],
                "content": file_info["content"],
                "tags": file_tags,
            }
        )

    return populated_files


@app.get("/api/files", response_class=JSONResponse)
async def get_files():
    files = []

    if os.path.exists(DATA_FILES_DIR):
        # Get all files in files directory
        files = [
            f
            for f in os.listdir(DATA_FILES_DIR)
            if os.path.isfile(os.path.join(DATA_FILES_DIR, f))
        ]

        # Sort files by alphabetical order
        files.sort()

    files = populate_files(files)

    # Store checksum of files in config
    checksum = hashlib.sha256(json.dumps(files).encode("utf-8")).hexdigest()

    # Check if files updated since last load
    if "files_checksum" in config and config["files_checksum"] == checksum:
        # Write new checksum
        config["files_checksum"] = checksum

        with open(CONFIG_PATH, "w") as f:
            json.dump(config, f, indent=4)

        # Sync using github url if provided
        if "github_url" in config and config["github_url"]:
            github_url = config["github_url"]

            # Use simple commit and push
            today_str = datetime.today().strftime("%Y-%m-%d %H:%M:%S")
            commit_message = f"Sync files with GitHub ({today_str})"

            print(f"Syncing files with GitHub: {github_url}")

            os.system(f"git add {DATA_FILES_DIR} && git commit -m '{commit_message}'")
            os.system(f"git push {github_url}")

    config["files_checksum"] = checksum

    with open(CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=4)

    return {"files": files}


file_cache = {}


@app.get("/api/files/{filename}", response_class=PlainTextResponse)
async def view_file(filename: str):
    if filename in file_cache:
        return file_cache[filename]

    file_path = os.path.join(DATA_FILES_DIR, filename)

    if not os.path.exists(file_path):
        return PlainTextResponse("File not found", status_code=404)

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    file_tags = get_tags_for_item(filename)

    return {"name": filename, "content": content, "tags": file_tags}


@app.get("/api/files/{filename}/download", response_class=FileResponse)
async def download_file(filename: str):
    file_path = os.path.join(DATA_FILES_DIR, filename)

    if os.path.exists(file_path):
        return FileResponse(file_path, filename=filename)

    return PlainTextResponse("File not found", status_code=404)


@app.post("/api/files", response_class=JSONResponse)
async def upload_file(request: Request, files: List[UploadFile] = File(...)):
    os.makedirs(DATA_FILES_DIR, exist_ok=True)

    for file in files:
        file_path = os.path.join(DATA_FILES_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    # Update last document change time in state
    assist_model.last_document_change = datetime.now()

    # Return updated file list as JSON
    updated_files = []
    if os.path.exists(DATA_FILES_DIR):
        updated_files = [
            f
            for f in os.listdir(DATA_FILES_DIR)
            if os.path.isfile(os.path.join(DATA_FILES_DIR, f))
        ]
        updated_files.sort()

    # Clear file_cache if it exists
    for file in files:
        if file.filename in file_cache:
            del file_cache[file.filename]

    return {"files": updated_files}


@app.post("/api/files/note")
async def upload_note(filename: str = Form(...), content: str = Form(...)):
    os.makedirs(DATA_FILES_DIR, exist_ok=True)
    file_path = os.path.join(DATA_FILES_DIR, filename)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

    # Update last document change time in state
    assist_model.last_document_change = datetime.now()

    # Clear file_cache if it exists
    if filename in file_cache:
        del file_cache[filename]

    # Optionally reload vector store if needed
    return {"success": True, "filename": filename}


@app.put("/api/files/{filename}", response_class=JSONResponse)
async def update_file(
    filename: str,
    content: str = Form(...),
):
    file_path = os.path.join(DATA_FILES_DIR, filename)

    if not os.path.exists(file_path):
        return JSONResponse({"error": "File not found"}, status_code=404)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

    # Update last document change time in state
    assist_model.last_document_change = datetime.now()

    # Clear file_cache if it exists
    if filename in file_cache:
        del file_cache[filename]

    return {"success": True, "filename": filename}


@app.delete("/api/files/{filename}", response_class=JSONResponse)
async def delete_file(filename: str):
    file_path = os.path.join(DATA_FILES_DIR, filename)

    if os.path.exists(file_path):
        os.remove(file_path)

    # Update last document change time in state
    assist_model.last_document_change = datetime.now()

    # Return updated file list as JSON
    updated_files = []
    if os.path.exists(DATA_FILES_DIR):
        updated_files = [
            f
            for f in os.listdir(DATA_FILES_DIR)
            if os.path.isfile(os.path.join(DATA_FILES_DIR, f))
        ]
        updated_files.sort()

    # Clear file_cache if it exists
    if filename in file_cache:
        del file_cache[filename]

    remove_item_from_all_tags(filename)

    return {"files": updated_files}


@app.post("/api/files/reload", response_class=JSONResponse)
async def reload_model():
    # Reload the vector store based on the new documents
    assist_model.load_documents()
    assist_model.load_vector_store(force=True)

    # Update last updated in state
    assist_model.last_updated = datetime.now()

    # Return updated file list as JSON
    updated_files = []

    if os.path.exists(DATA_FILES_DIR):
        updated_files = [
            f
            for f in os.listdir(DATA_FILES_DIR)
            if os.path.isfile(os.path.join(DATA_FILES_DIR, f))
        ]
        updated_files.sort()

    return {"files": updated_files}


def populate_urls(urls):
    populated_urls = []

    for url in urls:
        file_info = get_file_info(filename=url["filename"], data_dir=DATA_URLS_DIR)

        file_tags = get_tags_for_item(url["id"])

        populated_urls.append(
            {
                "id": url["id"],
                "url": url["url"],
                "filename": url.get("filename", ""),
                "content": file_info["content"] if file_info else None,
                "tags": file_tags,
            }
        )

    return populated_urls


@app.get("/api/urls", response_class=JSONResponse)
async def get_urls():
    urls = load_urls_index()

    urls = populate_urls(urls)

    return {"urls": urls}


url_cache = {}


@app.get("/api/urls/{url_id}", response_class=PlainTextResponse)
async def view_url(url_id: str):
    if url_id in url_cache:
        return url_cache[url_id]

    urls = load_urls_index()
    url = next((u for u in urls if u["id"] == url_id), None)

    if not url:
        return PlainTextResponse("URL not found", status_code=404)

    file_info = get_file_info(filename=url["filename"], data_dir=DATA_URLS_DIR)

    return {
        "id": url["id"],
        "url": url["url"],
        "filename": url.get("filename", ""),
        "content": file_info["content"] if file_info else None,
    }


@app.post("/api/urls", response_class=JSONResponse)
async def add_url(data: dict = Body(...)):
    url = data.get("url", "").strip()

    if not url:
        return JSONResponse({"error": "No URL provided"}, status_code=400)

    urls = load_urls_index()
    url_id = url_to_id(url)

    # Prevent duplicates
    if any(u["id"] == url_id for u in urls):
        return {"urls": urls}

    # Fetch and parse
    try:
        resp = requests.get(url, timeout=10)
        resp.raise_for_status()
        soup = BeautifulSoup(resp.text, "html.parser")
        text = soup.get_text(separator="\n", strip=True)
    except Exception as e:
        return JSONResponse({"error": f"Failed to fetch URL: {e}"}, status_code=400)

    # Save text file
    os.makedirs(DATA_URLS_DIR, exist_ok=True)

    txt_filename = url_txt_filename(url_id)
    txt_path = os.path.join(DATA_URLS_DIR, txt_filename)

    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)

    # Add to index
    urls.append({"id": url_id, "url": url, "filename": txt_filename})
    save_urls_index(urls)

    # Update last document change time
    assist_model.last_document_change = datetime.now()

    return {"urls": urls, "success": True, "url_id": url_id}


@app.put("/api/urls/{url_id}", response_class=JSONResponse)
async def update_url(
    url_id: str,
    content: str = Form(...),
):
    urls = load_urls_index()
    url = next((u for u in urls if u["id"] == url_id), None)

    if not url:
        return JSONResponse({"error": "URL not found"}, status_code=404)

    filename = url.get("filename", "")

    if not filename:
        return JSONResponse({"error": "Filename not found"}, status_code=404)

    url_path = os.path.join(DATA_URLS_DIR, filename)

    if not os.path.exists(url_path):
        return JSONResponse({"error": "File not found"}, status_code=404)

    with open(url_path, "w", encoding="utf-8") as f:
        f.write(content)

    assist_model.last_document_change = datetime.now()

    if url_id in url_cache:
        del url_cache[url_id]

    return {"urls": urls}


@app.delete("/api/urls/{url_id}", response_class=JSONResponse)
async def delete_url(url_id: str):
    urls = load_urls_index()
    urls_new = [u for u in urls if u["id"] != url_id]

    # Remove file if present
    for u in urls:
        if u["id"] == url_id:
            txt_path = os.path.join(DATA_URLS_DIR, u.get("filename", ""))
            if os.path.exists(txt_path):
                os.remove(txt_path)

    save_urls_index(urls_new)

    assist_model.last_document_change = datetime.now()

    # Clear cache if it exists
    if url_id in url_cache:
        del url_cache[url_id]

    remove_item_from_all_tags(url_id)

    return {"urls": urls_new}


@app.get("/api/tags", response_class=JSONResponse)
async def get_all_tags():
    tags = load_tags()

    return tags


def load_tags():
    if os.path.exists(TAGS_PATH):
        with open(TAGS_PATH, "r", encoding="utf-8") as f:
            return json.load(f)
    return {}


def save_tags(tags):
    with open(TAGS_PATH, "w", encoding="utf-8") as f:
        json.dump(tags, f, indent=2)


def get_tags_for_item(item, tags=None):
    if not tags:
        tags = load_tags()

    return [tag for tag, items in tags.items() if item in items]


def add_tag_to_item(tag, item):
    tags = load_tags()
    if tag not in tags:
        tags[tag] = []
    if item not in tags[tag]:
        tags[tag].append(item)
    save_tags(tags)


def remove_tag_from_item(tag, item):
    tags = load_tags()
    if tag in tags and item in tags[tag]:
        tags[tag].remove(item)
        if not tags[tag]:
            del tags[tag]
        save_tags(tags)


def remove_item_from_all_tags(item):
    tags = load_tags()
    changed = False
    for tag in list(tags.keys()):
        if item in tags[tag]:
            tags[tag].remove(item)
            changed = True
        if not tags[tag]:
            del tags[tag]
    if changed:
        save_tags(tags)


@app.get("/api/tags/{item}", response_class=JSONResponse)
async def get_tags_for(item: str):
    tags = get_tags_for_item(item)
    return {"tags": tags}


@app.post("/api/tags/{item}", response_class=JSONResponse)
async def add_tag(item: str, tag: str = Form(...)):
    add_tag_to_item(tag, item)
    return {"success": True, "tags": get_tags_for_item(item)}


@app.delete("/api/tags/{item}", response_class=JSONResponse)
async def remove_tag(item: str, tag: str = Form(...)):
    remove_tag_from_item(tag, item)
    return {"success": True, "tags": get_tags_for_item(item)}


# --- Settings Management ---


@app.get("/api/settings")
async def get_settings():
    if not os.path.exists(CONFIG_PATH):
        # Return the current settings as JSON
        return {
            "chat_model": assist_model.chat_model,
            "embedding_model": assist_model.embedding_model,
            "temperature": assist_model.temperature,
            "github_url": "",
        }

    with open(CONFIG_PATH, "r") as f:
        return json.load(f)


@app.put("/api/settings", response_class=JSONResponse)
async def update_settings(
    request: Request,
    chat_model: str = Form("gemma3:1b"),
    embedding_model: str = Form("gemma3:1b"),
    temperature: float = Form(0.1),
    github_url: str = Form(""),
):
    # Update the settings in the assist_model instance
    assist_model.chat_model = chat_model
    assist_model.embedding_model = embedding_model
    assist_model.temperature = temperature

    # Reload model chain
    assist_model.load_model()

    # Store in config.json
    config["chat_model"] = chat_model
    config["embedding_model"] = embedding_model
    config["temperature"] = temperature
    config["github_url"] = github_url

    with open(CONFIG_PATH, "w") as f:
        json.dump(config, f, indent=4)

    return {
        "chat_model": chat_model,
        "embedding_model": embedding_model,
        "temperature": temperature,
        "github_url": github_url,
    }


# Catch-all route for client-side routing (Solid.js)
@app.get("/{full_path:path}", response_class=HTMLResponse)
async def catch_all(request: Request, full_path: str):
    # Only serve index.html for non-API, non-assets paths
    if full_path.startswith("api/") or full_path.startswith("assets/"):
        return PlainTextResponse("Not Found", status_code=404)

    return templates.TemplateResponse("index.html", {"request": request})
