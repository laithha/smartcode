from app.api.Repository.user_repository import UserRepository
from app.api.auth import create_access_token
from app.api.utils.email import send_verification_email
from passlib.context import CryptContext
from fastapi import HTTPException
from datetime import datetime, timedelta
import random

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, repo:UserRepository):
        self.repo = repo
    
    def get_user_by_id(self,id):
        user = self.repo.get_user_by_id(id)
        if user is None:
            raise HTTPException(status_code=404, detail=f"User with {id} id is not found")
        return user
        
    def get_all_users(self):
        users = self.repo.get_all_users()
        if users is None:
            return []
        return users

    @staticmethod
    def _check_password_length(password):
        if len(password) < 8:
            raise HTTPException(status_code=400, detail="Password must be at least 8 characters")

    @staticmethod
    def _public_user(row):
        # Map a raw users row to a safe dict. NEVER include password_hash or the
        # verification code/expiry — those must never leave the backend.
        return {
            "id": row[0],
            "email": row[1],
            "is_admin": row[3],
            "is_verified": row[4],
            "show_on_leaderboard": row[7],
            "username": row[8],
        }

    def get_public_user_by_id(self, id):
        return self._public_user(self.get_user_by_id(id))

    def get_all_public_users(self):
        return [self._public_user(row) for row in self.get_all_users()]

    def login(self, email, password):
        user_info = self.repo.get_user_by_email(email)
        if user_info is None:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        passw = pwd_context.verify(password, user_info[2])
        if not passw:
            raise HTTPException(status_code=401, detail="Invalid email or password")

        if not user_info[4]:
            raise HTTPException(status_code=403, detail="Please verify your email before logging in")

        user_id = user_info[0]
        token = create_access_token(user_id)
        return {"access_token": token, "token_type": "bearer", "user_id": user_id}
    
    def create_user(self, email, password):
        self._check_password_length(password)
        reg_check = self.repo.get_user_by_email(email)
        if reg_check is not None:
            raise HTTPException(status_code=409, detail=f"Account already exists for {email}")
        self.repo.create_user(email, pwd_context.hash(password))
        code = str(random.randint(100000, 999999))
        expires = datetime.utcnow() + timedelta(minutes=15)
        self.repo.set_verification_code(email, code, expires)
        send_verification_email(email, code)
        return {"message": "Account created. Check your email for the verification code."}

    def verify_email(self, email, code):
        user = self.repo.get_user_by_email(email)
        if user is None:
            raise HTTPException(status_code=404, detail="Account not found")
        info = self.repo.get_verification_info(email)
        if info is None or info[0] is None:
            raise HTTPException(status_code=400, detail="No verification code found")
        stored_code, expires = info
        if datetime.utcnow() > expires:
            raise HTTPException(status_code=400, detail="Verification code has expired")
        if stored_code != code:
            raise HTTPException(status_code=400, detail="Incorrect verification code")
        self.repo.mark_user_verified(email)
        return {"message": "Email verified successfully"}


    def resend_verification(self, email):
        user = self.repo.get_user_by_email(email)
        if user is None:
            raise HTTPException(status_code=404, detail="Account not found")
        if user[4]:
            raise HTTPException(status_code=400, detail="Email is already verified")
        code = str(random.randint(100000, 999999))
        expires = datetime.utcnow() + timedelta(minutes=15)
        self.repo.set_verification_code(email, code, expires)
        send_verification_email(email, code)
        return {"message": "New verification code sent"}

    def change_password(self, user_id, current_password, new_password):
        user = self.repo.get_user_by_id(user_id)
        if user is None:
            raise HTTPException(status_code=404, detail="User not found")
        if not pwd_context.verify(current_password, user[2]):
            raise HTTPException(status_code=400, detail="Current password is incorrect")
        self._check_password_length(new_password)
        self.repo.update_password(user[1], pwd_context.hash(new_password))
        return {"message": "Password changed successfully"}

    def request_password_reset(self, email):
        user = self.repo.get_user_by_email(email)
        if user is None:
            raise HTTPException(status_code=404, detail="Account not found")
        code = str(random.randint(100000, 999999))
        expires = datetime.utcnow() + timedelta(minutes=15)
        self.repo.set_verification_code(email, code, expires)
        send_verification_email(email, code)
        return {"message": "Password reset code sent to your email"}

    def reset_password(self, email, code, new_password):
        user = self.repo.get_user_by_email(email)
        if user is None:
            raise HTTPException(status_code=404, detail="Account not found")
        self._check_password_length(new_password)
        info = self.repo.get_verification_info(email)
        if info is None or info[0] is None:
            raise HTTPException(status_code=400, detail="No reset code found")
        stored_code, expires = info
        if datetime.utcnow() > expires:
            raise HTTPException(status_code=400, detail="Reset code has expired")
        if stored_code != code:
            raise HTTPException(status_code=400, detail="Incorrect reset code")
        self.repo.update_password(email, pwd_context.hash(new_password))
        return {"message": "Password reset successfully"}

    def update_user_admin_status(self,user_id, is_admin):
        self.repo.update_user_admin_status(user_id, is_admin)
        return {"message" : "updated successfully"}
    
    def delete_user(self, user_id):
        self.get_user_by_id(user_id)
        self.repo.delete_user(user_id)
        return {"message": "deleted account successfully"}

    def update_username(self, user_id, username):
        self.get_user_by_id(user_id)
        if len(username) < 3:
            raise HTTPException(status_code=400, detail="Username must be at least 3 characters")
        if len(username) > 50:
            raise HTTPException(status_code=400, detail="Username must be at most 50 characters")
        try:
            self.repo.update_username(user_id, username)
        except Exception:
            raise HTTPException(status_code=409, detail="Username already taken")
        return {"message": "Username updated successfully"}

    def update_leaderboard_visibility(self, user_id, show_on_leaderboard):
        self.get_user_by_id(user_id)
        self.repo.update_leaderboard_visibility(user_id, show_on_leaderboard)
        return {"message": "Leaderboard visibility updated"}

    def get_leaderboard_visibility(self, user_id):
        self.get_user_by_id(user_id)
        return {"show_on_leaderboard": self.repo.get_leaderboard_visibility(user_id)}