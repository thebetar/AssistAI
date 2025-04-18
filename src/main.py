from fastapi import FastAPI, Request, Form
from fastapi.responses import HTMLResponse
from fastapi.templating import Jinja2Templates
from fastapi.staticfiles import StaticFiles
from pydantic import BaseModel

from model import CustomDocumentModel

app = FastAPI()

app.mount("/static", StaticFiles(directory="static"), name="static")
templates = Jinja2Templates(directory="templates")

model = CustomDocumentModel(
    silent=False,
    refresh=False,
)


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
