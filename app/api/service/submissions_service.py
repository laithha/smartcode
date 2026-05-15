from app.api.Repository.submissions_repository import SubmissionsRepository

class SubmissionsService:
    def __init__(self, repo: SubmissionsRepository):
        self.repo = repo

    def save_submission(self, user_id, lesson_id, code, language):
        self.repo.create_submission(user_id, lesson_id, code, language)
        return {"message": "Submission saved"}

    def get_submissions(self, user_id, lesson_id):
        rows = self.repo.get_submissions_by_user_and_lesson(user_id, lesson_id)
        return [
            {
                "submission_id": row[0],
                "code": row[1],
                "language": row[2],
                "submitted_at": row[3].strftime("%Y-%m-%d %H:%M") if row[3] else None
            }
            for row in rows
        ]
