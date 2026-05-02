from fastapi import APIRouter, Depends, HTTPException
from app.api.Repository.progress_repository import ProgressRepository
import app.api.dependencies.di as di
from app.api.dependencies.di import get_current_user
from pydantic import BaseModel

router = APIRouter()

@router.get("/progress/{user_id}", tags=["progress"])
def get_progress_by_user_id(user_id: int, current_user = Depends(get_current_user)):
    if int(current_user) != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    service = di.get_progress_service()
    user = service.get_progress_by_user_id(user_id)
    return {"user": user}


class ProgressRequest(BaseModel):
    user_id: int
    lesson_id: int
    status: str

@router.post("/progress")
def create_progress(request: ProgressRequest, current_user = Depends(get_current_user)):
    if int(current_user) != request.user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    service = di.get_progress_service()
    user = service.create_progress(request.user_id, request.lesson_id, request.status)
    return user

@router.get("/progress/{user_id}/recommendation", tags=["progress"])
def get_recommendation(user_id: int, current_user = Depends(get_current_user)):
    if int(current_user) != user_id:
        raise HTTPException(status_code=403, detail="Access denied")
    service = di.get_progress_service()
    return service.get_recommendation(user_id)