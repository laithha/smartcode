from fastapi import APIRouter , Depends
from pydantic import BaseModel
import app.api.dependencies.di as di
from app.api.dependencies.di import get_current_user
router = APIRouter()

class ReviewRequest(BaseModel): 
    code: str
    language: str
    lesson_title: str
    lesson_description: str

@router.post("/ai-review")
def ai_review(request: ReviewRequest, current_user= Depends(get_current_user)):
    result = di.get_ai_service().review_code(request.code, request.language, request.lesson_title, request.lesson_description)
    return{"feedback" :result}