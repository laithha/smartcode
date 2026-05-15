from app.api.service.user_service import UserService
from app.api.Repository.user_repository import UserRepository
import app.api.dependencies.di as di
from app.api.dependencies.di import get_current_user, get_admin_user
from fastapi import APIRouter, Depends, HTTPException
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
def delete_user(user_id: int, current_user = Depends(get_current_user)):
    user = di.user_repo.get_user_by_id(int(current_user))
    is_admin = user is not None and user[3] == True
    if int(current_user) != user_id and not is_admin:
        raise HTTPException(status_code=403, detail="Forbidden")
    service = di.get_user_service()
    return service.delete_user(user_id)


class VerifyEmailRequest(BaseModel):
    email: str
    code: str

@router.post("/verify-email", tags=["verify"])
def verify_email(request: VerifyEmailRequest):
    service = di.get_user_service()
    return service.verify_email(request.email, request.code)

class ResendCodeRequest(BaseModel):
    email: str

@router.post("/resend-verification", tags=["verify"])
def resend_verification(request: ResendCodeRequest):
    service = di.get_user_service()
    return service.resend_verification(request.email)

class ChangePasswordRequest(BaseModel):
    current_password: str
    new_password: str

@router.put("/users/{user_id}/password", tags=["users"])
def change_password(user_id: int, request: ChangePasswordRequest, current_user = Depends(get_current_user)):
    if int(current_user) != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    service = di.get_user_service()
    return service.change_password(user_id, request.current_password, request.new_password)

class ForgotPasswordRequest(BaseModel):
    email: str

@router.post("/forgot-password", tags=["password"])
def forgot_password(request: ForgotPasswordRequest):
    service = di.get_user_service()
    return service.request_password_reset(request.email)

class ResetPasswordRequest(BaseModel):
    email: str
    code: str
    new_password: str

@router.post("/reset-password", tags=["password"])
def reset_password(request: ResetPasswordRequest):
    service = di.get_user_service()
    return service.reset_password(request.email, request.code, request.new_password)

class UsernameRequest(BaseModel):
    username: str

@router.put("/users/{user_id}/username", tags=["users"])
def update_username(user_id: int, request: UsernameRequest, current_user = Depends(get_current_user)):
    if int(current_user) != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    service = di.get_user_service()
    return service.update_username(user_id, request.username)

class AdminStatusRequest(BaseModel):
    is_admin: bool

@router.put("/users/{user_id}/admin", tags=["admin"])
def update_admin_status(user_id: int, request: AdminStatusRequest, current_user = Depends(get_admin_user)):
    service = di.get_user_service()
    update_admin = service.update_user_admin_status(user_id, request.is_admin)
    return update_admin