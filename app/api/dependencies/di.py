from app.api.database import conn
from fastapi import Depends
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
ai_service = AIService()
tip_repo = TipRepository(conn)
tip_service = TipService(tip_repo)
user_repo = UserRepository(conn)
user_service = UserService(user_repo)
progress_repo = ProgressRepository(conn)
progress_service = ProgressService(progress_repo)
lesson_repo = LessonRepository(conn)
lesson_service = LessonService(lesson_repo)
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