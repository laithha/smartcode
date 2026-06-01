from fastapi import APIRouter, Depends
from pydantic import BaseModel
import app.api.dependencies.di as di
from app.api.dependencies.di import get_current_user

router = APIRouter()

@router.get("/leaderboard", tags=["leaderboard"])
def get_leaderboard():
    service = di.get_leaderboard_service()
    return {"leaderboard": service.get_leaderboard()}

class LeaderboardVisibilityRequest(BaseModel):
    show_on_leaderboard: bool
    

@router.put("/users/{user_id}/leaderboard-visibility", tags=["leaderboard"])
def update_leaderboard_visibility(user_id: int, request: LeaderboardVisibilityRequest, current_user = Depends(get_current_user)):
    from fastapi import HTTPException
    if int(current_user) != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    service = di.get_user_service()
    return service.update_leaderboard_visibility(user_id, request.show_on_leaderboard)

@router.get("/users/{user_id}/leaderboard-visibility", tags=["leaderboard"])
def get_leaderboard_visibility(user_id: int, current_user = Depends(get_current_user)):
    from fastapi import HTTPException
    if int(current_user) != user_id:
        raise HTTPException(status_code=403, detail="Forbidden")
    service = di.get_user_service()
    return service.get_leaderboard_visibility(user_id)
