from app.api.Repository.progress_repository import ProgressRepository
from fastapi import HTTPException
class ProgressService:
    def __init__(self, repo:ProgressRepository):
        self.repo = repo

    def get_progress_by_user_id(self, user_id):
        prog_id = self.repo.get_progress_by_id(user_id)
        return {"prog_id" : prog_id}

    def create_progress(self,user_id, lesson_id, status):
        progress = self.repo.create_progress(user_id, lesson_id, status)
        return {"message" : "progress saved successfully"}