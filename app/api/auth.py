from dotenv import load_dotenv
from jose import jwt , JWTError
import os
from datetime import datetime, timedelta
from fastapi import HTTPException
load_dotenv()
secret = os.getenv("SECRET_KEY")


def create_access_token(user_id):
    payload = {
        "sub" : str(user_id),
        "exp" : datetime.utcnow() + timedelta(hours=1)
    }
    result = jwt.encode(payload, secret, algorithm="HS256")
    return result

def verify_token(token):
    try:
        payload = jwt.decode(token, secret, algorithms=["HS256"])
        result = payload["sub"]
        return(result)
    except JWTError: 
        raise HTTPException(status_code=401, detail="invalid or expired token")
