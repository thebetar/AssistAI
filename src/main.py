from fastapi import FastAPI, Request, Form, UploadFile, File
from fastapi.responses import HTMLResponse, FileResponse, RedirectResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel
import os
import shutil
from typing import List

from model import CustomDocumentModel

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

model = CustomDocumentModel(
    silent=False,
    refresh=False,
)

DATA_FILES_DIR = os.path.join(os.path.dirname(__file__), "data", "files")


class QuestionQuery(BaseModel):
    question: str


@app.get("/", response_class=HTMLResponse)
async def root(request: Request):
    return templates.TemplateResponse(
        "template.html", {"request": request, "response": None}
    )


@app.post("/", response_class=HTMLResponse)
async def ask_question(request: Request, question: str = Form(...)):
    response = model.invoke(question)
    return templates.TemplateResponse(
        "template.html",
        {"request": request, "response": response, "question": question},
    )


@app.post("/question")
async def question(query: QuestionQuery):
    response = model.invoke(query.question)
    return response


# --- Document Management ---


@app.get("/manage", response_class=HTMLResponse)
async def manage_files(request: Request, success: str = None):
    files = []
    if os.path.exists(DATA_FILES_DIR):
        files = [
            f
            for f in os.listdir(DATA_FILES_DIR)
            if os.path.isfile(os.path.join(DATA_FILES_DIR, f))
        ]
        # Sort files by alphabetical order
        files.sort()

    return templates.TemplateResponse(
        "manage.html", {"request": request, "files": files, "success": success}
    )


@app.post("/manage/upload")
async def upload_file(request: Request, files: List[UploadFile] = File(...)):
    os.makedirs(DATA_FILES_DIR, exist_ok=True)
    for file in files:
        file_path = os.path.join(DATA_FILES_DIR, file.filename)
        with open(file_path, "wb") as buffer:
            shutil.copyfileobj(file.file, buffer)
    # Redirect with success message
    return RedirectResponse(url="/manage?success=1", status_code=303)


@app.get("/manage/download/{filename}")
async def download_file(filename: str):
    file_path = os.path.join(DATA_FILES_DIR, filename)
    if os.path.exists(file_path):
        return FileResponse(file_path, filename=filename)
    return HTMLResponse("File not found", status_code=404)


@app.post("/manage/delete/{filename}")
async def delete_file(filename: str):
    file_path = os.path.join(DATA_FILES_DIR, filename)
    if os.path.exists(file_path):
        os.remove(file_path)
    return RedirectResponse(url="/manage", status_code=303)
