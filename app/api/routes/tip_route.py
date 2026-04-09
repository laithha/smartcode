from fastapi import APIRouter
from app.api.database import conn
import app.api.dependencies.di as di

router = APIRouter()

@router.get("/tips", tags=["tips"])
def get_tip(lesson_id: int):
    service = di.get_tip_service()
    lesson = service.get_tip_by_id(lesson_id)
    return (lesson)