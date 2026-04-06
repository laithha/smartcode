from app.api.service.user_service import UserService
from app.api.Repository.user_repository import UserRepository
from app.api.database import conn
import app.api.dependencies.di as di
from fastapi import APIRouter
from pydantic import BaseModel

router = APIRouter()

@router.get("/users/{id}", tags = ["userID"])
def get_user_by_id(id: int):
    service = di.get_user_service()
    user = service.get_user_by_id(id)
    return{"user": user}

@router.get("/users", tags = ["users"])
def get_all_users():
    service = di.get_user_service()
    users = service.get_all_users()
    return{"users": users}

class LoginRequest(BaseModel):
    email: str
    password: str

@router.post("/login", tags = ["login"])
def login(request :LoginRequest):
    service = di.get_user_service()
    users = service.login(request.email, request.password)
    return users

class RegisterRequest(BaseModel):
    email: str
    password: str

@router.post("/register", tags=["Register"])
def create_user(request: RegisterRequest):
    service = di.get_user_service()
    users = service.create_user(request.email, request.password)
    return{"users" : users}