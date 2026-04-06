from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.user_route import router as user_router
from app.api.routes.progress_route import router as progress_router
from app.api.routes.lesson_route import router as lesson_router
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