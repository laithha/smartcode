from app.api.database import conn
import app.api.dependencies.di as di
from fastapi import APIRouter

router = APIRouter()

@router.get("/lessons/{id}", tags = ["lessonID"])
def get_lesson_by_id(id: int):
    service = di.get_lesson_service()
    lesson = service.get_lesson_by_id(id)
    return {
        "lesson_id": lesson[0],
        "title": lesson[1],
        "description": lesson[2],
        "content": lesson[3],
        "language": lesson[4],
        "difficulty": lesson[5],
        "duration": lesson[6]
    }

@router.get("/lessons", tags=["lessons"])
def get_all_lessons():
    service = di.get_lesson_service()
    lessons = service.get_all_lessons()
    return [
        {
            "lesson_id": l[0],
            "title": l[1],
            "description": l[2],
            "content": l[3],
            "language": l[4],
            "difficulty": l[5],
            "duration": l[6]
        }
        for l in lessons
    ]