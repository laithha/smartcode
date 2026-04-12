from app.api.Repository.progress_repository import ProgressRepository
from fastapi import HTTPException
class ProgressService:
    def __init__(self, repo:ProgressRepository):
        self.repo = repo

    def get_progress_by_user_id(self, user_id):
        prog_id = self.repo.get_progress_by_id(user_id)
        prog = [{"progress_id": row[0], "status": row[1], "title": row[2], "language": row[3], "difficulty": row[4]} for row in prog_id]
        return {"prog" : prog}

    def create_progress(self,user_id, lesson_id, status):
        prog_exists = self.repo.get_progress_by_user_and_lesson(user_id, lesson_id)
        if prog_exists is None:
            progress = self.repo.create_progress(user_id, lesson_id, status)
            return {"message" : "progress saved successfully"}
        
        raise HTTPException(status_code=400, detail="Lesson already completed")