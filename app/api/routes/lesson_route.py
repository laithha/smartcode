import app.api.dependencies.di as di
from fastapi import APIRouter, Depends
from pydantic import BaseModel
from app.api.dependencies.di import get_admin_user
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

class CreateLessonRequest(BaseModel):
    title: str
    description: str
    content: str
    language: str
    difficulty: str
    duration: int

@router.post("/lessons")
def create_lesson(request:CreateLessonRequest, current_user= Depends(get_admin_user)):
    service = di.get_lesson_service()
    create = service.create_lesson(request.title, request.description, request.content, request.language,request.difficulty, request.duration)
    return create

@router.delete("/lessons/{lesson_id}")
def delete_lessons(lesson_id: int, current_user= Depends(get_admin_user)):
    service = di.get_lesson_service()
    delete = service.delete_lesson(lesson_id)
    return delete