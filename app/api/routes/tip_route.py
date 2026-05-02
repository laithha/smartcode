from fastapi import APIRouter
import app.api.dependencies.di as di

router = APIRouter()

@router.get("/tips", tags=["tips"])
def get_tip(lesson_id: int):
    service = di.get_tip_service()
    lesson = service.get_tip_by_id(lesson_id)
    return [{
      "tip_id": l[0],
      "category": l[1],
      "message": l[2]
    } 
    for l in lesson]