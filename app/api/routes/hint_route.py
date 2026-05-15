from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
from typing import List, Optional
import app.api.dependencies.di as di
from app.api.dependencies.di import get_current_user

router = APIRouter()

class Message(BaseModel):
    role: str
    content: str

class HintRequest(BaseModel):
    question: str = Field(..., max_length=500)
    lesson_title: str = Field(..., max_length=200)
    lesson_description: str = Field(..., max_length=1000)
    language: str = Field(..., max_length=50)
    conversation_history: Optional[List[Message]] = []

@router.post("/ai-hint", tags=["hint"])
def ask_hint(request: HintRequest, current_user = Depends(get_current_user)):
    history = [{"role": m.role, "content": m.content} for m in (request.conversation_history or [])]
    answer = di.get_ai_service().ask_hint(
        request.question,
        request.lesson_title,
        request.lesson_description,
        request.language,
        history
    )
    return {"answer": answer}
