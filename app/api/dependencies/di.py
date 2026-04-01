
from app.api.database import conn
from app.api.Repository.user_repository import UserRepository
from app.api.service.user_service import UserService
from app.api.Repository.progress_repository import ProgressRepository
from app.api.service.progress_service import ProgressService
user_repo = UserRepository(conn)
user_service = UserService(user_repo)
progress_repo = ProgressRepository(conn)
progress_service = ProgressService(progress_repo)
def get_user_service() ->UserService:
    return user_service

def get_progress_service() ->ProgressService:
    return progress_service