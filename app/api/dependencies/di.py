from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from app.api.auth import verify_token
from app.api.Repository.user_repository import UserRepository
from app.api.service.user_service import UserService
from app.api.Repository.progress_repository import ProgressRepository
from app.api.service.progress_service import ProgressService
from app.api.Repository.lesson_repository import LessonRepository
from app.api.service.lesson_service import LessonService
from app.api.Repository.tip_repository import TipRepository
from app.api.service.tip_service import TipService
from app.api.service.ai_service import AIService
from app.api.Repository.leaderboard_repository import LeaderboardRepository
from app.api.service.leaderboard_service import LeaderboardService
from app.api.Repository.submissions_repository import SubmissionsRepository
from app.api.service.submissions_service import SubmissionsService
ai_service = AIService()
tip_repo = TipRepository()
tip_service = TipService(tip_repo)
user_repo = UserRepository()
user_service = UserService(user_repo)
lesson_repo = LessonRepository()
lesson_service = LessonService(lesson_repo)
progress_repo = ProgressRepository()
progress_service = ProgressService(progress_repo, lesson_repo)
leaderboard_repo = LeaderboardRepository()
leaderboard_service = LeaderboardService(leaderboard_repo)
submissions_repo = SubmissionsRepository()
submissions_service = SubmissionsService(submissions_repo)
def get_user_service() ->UserService:
    return user_service

def get_progress_service() ->ProgressService:
    return progress_service

def get_lesson_service() ->LessonService:
    return lesson_service

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/login")
def get_current_user(token = Depends(oauth2_scheme)):
      return verify_token(token)

def get_tip_service() -> TipService:
     return tip_service

def get_ai_service()->AIService:
     return ai_service

def get_leaderboard_service() -> LeaderboardService:
    return leaderboard_service

def get_submissions_service() -> SubmissionsService:
    return submissions_service

def get_admin_user(current_user = Depends(get_current_user)):
      user = user_repo.get_user_by_id(int(current_user))
      if user is None or user[3] != True:
          raise HTTPException(status_code=403, detail="admin access required")
      return current_user