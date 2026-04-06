from app.api.Repository.progress_repository import ProgressRepository

class ProgressService:
    def __init__(self, repo:ProgressRepository):
        self.repo = repo

    def get_progress_by_user_id(self, user_id):
        prog_id = self.repo.get_progress_by_id(user_id)
        return {"prog_id" : prog_id}

