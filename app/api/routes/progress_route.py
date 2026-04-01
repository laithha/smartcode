from app.api.service.progress_service import ProgressService
from fastapi import APIRouter
from app.api.Repository.progress_repository import ProgressRepository
from app.api.database import conn
import app.api.dependencies.di as di

router = APIRouter()

@router.get("/progress/{user_id}", tags=["progress"])
def get_progress_by_user_id(user_id: int):
    service = di.get_progress_service()
    user = service.get_progress_by_user_id(user_id)
    return {"user": user}

    