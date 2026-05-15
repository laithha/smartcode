from fastapi import APIRouter, Depends
from pydantic import BaseModel, Field
import app.api.dependencies.di as di
from app.api.dependencies.di import get_current_user
router = APIRouter()

class ReviewRequest(BaseModel):
    code: str
    language: str = Field(..., max_length=50)
    lesson_title: str = Field(..., max_length=200)
    lesson_description: str = Field(..., max_length=1000)
    lesson_task: str = Field(default="", max_length=2000)

@router.post("/ai-review")
def ai_review(request: ReviewRequest, current_user= Depends(get_current_user)):
    result = di.get_ai_service().review_code(request.code, request.language, request.lesson_title, request.lesson_description, request.lesson_task)
    return{"feedback" :result}