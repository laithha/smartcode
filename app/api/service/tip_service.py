from app.api.Repository.tip_repository import TipRepository
from fastapi import HTTPException
class TipService:
    def __init__(self, repo: TipRepository):
        self.repo = repo

    
    def get_tip_by_id(self, lesson_id):
        lesson = self.repo.get_tips_by_lesson_id(lesson_id)
        if lesson is None:
            raise HTTPException(status_code= 404, detail="no tips found for this lesson")
        return (lesson)
