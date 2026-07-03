from app.api.Repository.progress_repository import ProgressRepository
from app.api.Repository.lesson_repository import LessonRepository
from fastapi import HTTPException
from datetime import date
class ProgressService:
    def __init__(self, repo:ProgressRepository, lesson_repo:LessonRepository):
        self.repo = repo
        self.lesson_repo = lesson_repo

    def get_progress_by_user_id(self, user_id):
        prog_id = self.repo.get_progress_by_id(user_id)
        prog = [{"progress_id": row[0], "status": row[1], "title": row[2], "language": row[3], "difficulty": row[4], "lesson_id": row[5]} for row in prog_id]
        total = self.lesson_repo.count_lessons()[0]
        streak = self.get_streak(user_id)
        return {"prog" : prog, "total" :total, "streak" : streak }

    def create_progress(self,user_id, lesson_id, status):
        prog_exists = self.repo.get_progress_by_user_and_lesson(user_id, lesson_id)
        if prog_exists is None:
            progress = self.repo.create_progress(user_id, lesson_id, status)
            return {"message" : "progress saved successfully"}
        
        raise HTTPException(status_code=400, detail="Lesson already completed")
    
    def get_streak(self, user_id):
        rows = self.repo.get_completed_dates(user_id)
        dates = sorted(set(row[0] for row in rows), reverse=True)
        if not dates:
            return 0
        # The streak is only "alive" if the most recent completed lesson was
        # today or yesterday. If the last activity is older than that, a day was
        # missed, so the streak has expired and resets to 0.
        if (date.today() - dates[0]).days > 1:
            return 0
        # Count backwards from the most recent day, stopping at the first gap.
        streak = 1
        for i in range(1, len(dates)):
            if (dates[i - 1] - dates[i]).days == 1:
                streak += 1
            else:
                break
        return streak
    
    def get_recommendation(self, user_id):
        lesson = self.repo.get_recommendation(user_id)
        if lesson is None:                                                                                                                                                                                           
          return {"message": "You have completed all lessons!"}
        return {
          "lesson_id": lesson[0],
          "title": lesson[1],
          "description": lesson[2],
          "language": lesson[4],
          "difficulty": lesson[5],
          "duration": lesson[6]
        }