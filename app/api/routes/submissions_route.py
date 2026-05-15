from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
import app.api.dependencies.di as di
from app.api.dependencies.di import get_current_user

router = APIRouter()

class SubmissionRequest(BaseModel):
    user_id: int
    lesson_id: int
    code: str
    language: str

@router.post("/submissions", tags=["submissions"])
def save_submission(request: SubmissionRequest, current_user = Depends(get_current_user)):
    if int(current_user) != request.user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    service = di.get_submissions_service()
    return service.save_submission(request.user_id, request.lesson_id, request.code, request.language)

@router.get("/submissions", tags=["submissions"])
def get_submissions(user_id: int, lesson_id: int, current_user = Depends(get_current_user)):
    if int(current_user) != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    service = di.get_submissions_service()
    return {"submissions": service.get_submissions(user_id, lesson_id)}
