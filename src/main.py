from fastapi import FastAPI
from pydantic import BaseModel

from model import CustomDocumentModel

app = FastAPI()

model = CustomDocumentModel(
    silent=False,
    refresh=False,
)


class QuestionQuery(BaseModel):
    question: str


@app.get("/")
async def root():
    return {"message": "Assist AI is running!"}


@app.post("/question")
async def question(query: QuestionQuery):
    response = model.invoke(query.question)

    return response
