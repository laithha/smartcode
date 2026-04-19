from app.api.service.user_service import UserService
from app.api.Repository.user_repository import UserRepository
from app.api.database import conn
import app.api.dependencies.di as di
from app.api.dependencies.di import get_current_user, get_admin_user
from fastapi import APIRouter, Depends
from pydantic import BaseModel

router = APIRouter()

@router.get("/users/{id}", tags = ["userID"])
def get_user_by_id(id: int, current_user = Depends(get_current_user)):
    service = di.get_user_service()
    user = service.get_user_by_id(id)
    return{"user": user}

@router.get("/users", tags = ["users"])
def get_all_users(current_user = Depends(get_current_user)):
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

@router.delete("/users/{user_id}", tags=["delete"])
def delete_user(user_id, current_user = Depends(get_admin_user)):
    service = di.get_user_service()
    delete = service.delete_user(user_id)
    return delete


class AdminStatusRequest(BaseModel):
    is_admin: bool

@router.put("/users/{user_id}/admin", tags=["admin"])
def update_admin_status(user_id: int, request: AdminStatusRequest, current_user = Depends(get_admin_user)):
    service = di.get_user_service()
    update_admin = service.update_user_admin_status(user_id, request.is_admin)
    return update_admin