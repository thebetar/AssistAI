import json
import os
import shutil
from typing import List
from fastapi import FastAPI, Request, Form, UploadFile, File
from fastapi.responses import HTMLResponse, FileResponse, Response
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from model import CustomDocumentModel

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

assist_model = CustomDocumentModel(
    silent=False,
    refresh=False,
)

DATA_FILES_DIR = os.path.join(os.path.dirname(__file__), "data", "files")


class QuestionQuery(BaseModel):
    question: str


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    history = getattr(assist_model, "history", None)

    print("History:", history)

    return templates.TemplateResponse(
        "template.html", {"request": request, "history": history}
    )


@app.post("/question", response_class=Response)
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

    return json.dumps(
        {
            "response": response,
            "question": question,
            "history": chat_history,
            "use_rag": use_rag_bool,
        }
    )


# --- Document Management ---


@app.get("/manage", response_class=HTMLResponse)
async def manage_files(request: Request, updated: str = None):
    # Only render the template, no file list in context
    return templates.TemplateResponse(
        "manage.html",
        {"request": request, "updated": updated},
    )


@app.get("/manage/files")
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


@app.post("/manage/upload")
async def upload_file(request: Request, files: List[UploadFile] = File(...)):
    os.makedirs(DATA_FILES_DIR, exist_ok=True)

    for file in files:
        file_path = os.path.join(DATA_FILES_DIR, file.filename)

        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

    # Reload the vector store based on the new doucments
    assist_model.load_documents()
    assist_model.load_vector_store(force=True)

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


@app.get("/manage/download/{filename}")
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


@app.delete("/manage/delete/{filename}")
async def delete_file(filename: str):
    file_path = os.path.join(DATA_FILES_DIR, filename)

    if os.path.exists(file_path):
        os.remove(file_path)

    # Reload the vector store based on the new documetns
    assist_model.load_documents()
    assist_model.load_vector_store(force=True)

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
