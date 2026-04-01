from app.api.Repository.user_repository import UserRepository
from passlib.context import CryptContext

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

class UserService:
    def __init__(self, repo:UserRepository):
        self.repo = repo
    

    def get_user_by_id(self,id):
        user = self.repo.get_user_by_id(id)
        if user is None:
            raise Exception("User with {id} id is not found")
        return user
        
    def get_all_users(self):
        users = self.repo.get_all_users()
        if users is None:
            return Exception("there is no users")
        return users

    def login(self, email, password):
        user_info = self.repo.get_user_by_email(email)
        if user_info is None: 
            raise Exception("the email does not exist")
        
        passw = pwd_context.verify(password, user_info[2])
        if passw == False:
            raise Exception("wrong password")
        return{"message" :"login successful"}
