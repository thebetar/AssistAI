import json
import os
import shutil
from datetime import datetime
from typing import List
from fastapi import FastAPI, Request, Form, UploadFile, File, Body
from fastapi.responses import HTMLResponse, FileResponse, JSONResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
import hashlib
import requests
from bs4 import BeautifulSoup

from model import CustomDocumentModel

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

# Load the config.json file
config_path = os.path.join(os.path.dirname(__file__), "config.json")

# Read the config file
with open(config_path, "r") as f:
    config = json.load(f)

assist_model = CustomDocumentModel(
    silent=False,
    refresh=False,
    chat_model=config.get("chat_model", None),
    embedding_model=config.get("embedding_model", None),
    temperature=config.get("temperature", 0.1),
)

DATA_FILES_DIR = os.path.join(os.path.dirname(__file__), "data", "files")
URLS_INDEX_PATH = os.path.join(DATA_FILES_DIR, "urls.json")


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


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    history = getattr(assist_model, "history", None)
    pending = get_pending_status()

    return templates.TemplateResponse(
        "template.html", {"request": request, "history": history, "pending": pending}
    )


@app.post("/question", response_class=JSONResponse)
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


@app.get("/manage", response_class=HTMLResponse)
async def manage_files(request: Request, updated: str = None):
    pending = get_pending_status()

    # Only render the template, no file list in context
    return templates.TemplateResponse(
        "manage.html",
        {"request": request, "updated": updated, "pending": pending},
    )


@app.get("/manage/files", response_class=JSONResponse)
async def get_files():
    files = []

    if os.path.exists(DATA_FILES_DIR):
        files = [
            f
            for f in os.listdir(DATA_FILES_DIR)
            if os.path.isfile(os.path.join(DATA_FILES_DIR, f))
        ]
        # Sort files by alphabetical order
        files.sort()

    return {"files": files}


@app.post("/manage/upload", response_class=JSONResponse)
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

    return {"files": updated_files}


@app.post("/manage/upload_note")
async def upload_note(filename: str = Form(...), content: str = Form(...)):
    os.makedirs(DATA_FILES_DIR, exist_ok=True)
    file_path = os.path.join(DATA_FILES_DIR, filename)

    with open(file_path, "w", encoding="utf-8") as f:
        f.write(content)

    # Update last document change time in state
    assist_model.last_document_change = datetime.now()

    # Optionally reload vector store if needed
    return {"success": True, "filename": filename}


@app.get("/manage/download/{filename}", response_class=FileResponse)
async def download_file(filename: str):
    file_path = os.path.join(DATA_FILES_DIR, filename)

    if os.path.exists(file_path):
        return FileResponse(file_path, filename=filename)

    return HTMLResponse("File not found", status_code=404)


@app.get("/manage/view/{filename}", response_class=HTMLResponse)
async def view_file(filename: str):
    file_path = os.path.join(DATA_FILES_DIR, filename)

    if not os.path.exists(file_path):
        return HTMLResponse("File not found", status_code=404)

    with open(file_path, "r", encoding="utf-8") as f:
        content = f.read()

    # Render a template with the raw markdown, let JS (marked) render it
    return templates.TemplateResponse(
        "view_file.html",
        {"request": {}, "filename": filename, "content": content},
    )


@app.delete("/manage/delete/{filename}", response_class=JSONResponse)
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

    return {"files": updated_files}


@app.post("/manage/reload", response_class=JSONResponse)
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


@app.get("/manage/urls", response_class=JSONResponse)
async def get_urls():
    urls = load_urls_index()
    return {"urls": urls}


@app.post("/manage/add_url", response_class=JSONResponse)
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
    os.makedirs(DATA_FILES_DIR, exist_ok=True)

    txt_filename = url_txt_filename(url_id)
    txt_path = os.path.join(DATA_FILES_DIR, txt_filename)

    with open(txt_path, "w", encoding="utf-8") as f:
        f.write(text)

    # Add to index
    urls.append({"id": url_id, "url": url, "filename": txt_filename})
    save_urls_index(urls)

    # Update last document change time
    assist_model.last_document_change = datetime.now()

    return {"urls": urls}


@app.delete("/manage/delete_url/{url_id}", response_class=JSONResponse)
async def delete_url(url_id: str):
    urls = load_urls_index()
    urls_new = [u for u in urls if u["id"] != url_id]
    # Remove file if present
    for u in urls:
        if u["id"] == url_id:
            txt_path = os.path.join(DATA_FILES_DIR, u.get("filename", ""))
            if os.path.exists(txt_path):
                os.remove(txt_path)
    save_urls_index(urls_new)
    assist_model.last_document_change = datetime.now()
    return {"urls": urls_new}


@app.get("/settings", response_class=HTMLResponse)
async def settings_page(request: Request):
    pending = get_pending_status()

    return templates.TemplateResponse(
        "settings.html", {"request": request, "pending": pending}
    )


@app.get("/settings/get")
async def get_settings():
    # Return the current settings as JSON
    return {
        "chat_model": assist_model.chat_model,
        "embedding_model": assist_model.embedding_model,
        "temperature": assist_model.temperature,
    }


@app.post("/settings/update", response_class=JSONResponse)
async def update_settings(
    request: Request,
    chat_model: str = Form("gemma3:1b"),
    embedding_model: str = Form("gemma3:1b"),
    temperature: float = Form(0.1),
):
    # Update the settings in the assist_model instance
    assist_model.chat_model = chat_model
    assist_model.embedding_model = embedding_model
    assist_model.temperature = temperature

    # Reload model chain
    assist_model.load_model()

    # Store in config.json
    config_path = os.path.join(os.path.dirname(__file__), "config.json")
    config = {
        "chat_model": chat_model,
        "embedding_model": embedding_model,
        "temperature": temperature,
    }
    with open(config_path, "w") as f:
        json.dump(config, f, indent=4)

    return {
        "chat_model": chat_model,
        "embedding_model": embedding_model,
        "temperature": temperature,
    }
