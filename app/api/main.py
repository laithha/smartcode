from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.user_route import router as user_router
from app.api.routes.progress_route import router as progress_router
from app.api.routes.lesson_route import router as lesson_router
from app.api.routes.tip_route import router as tip_router
from app.api.routes.ai_route import router as ai_router
from app.api.routes.leaderboard_route import router as leaderboard_router
from app.api.routes.submissions_route import router as submissions_router
from app.api.routes.hint_route import router as hint_router
app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(user_router)
app.include_router(progress_router)
app.include_router(lesson_router)
app.include_router(tip_router)
app.include_router(ai_router)
app.include_router(leaderboard_router)
app.include_router(submissions_router)
app.include_router(hint_router)
