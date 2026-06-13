from app.api.Repository.lesson_repository import LessonRepository
from fastapi import HTTPException
class LessonService:
    def __init__(self, repo:LessonRepository):
        self.repo  = repo

    def get_lesson_by_id(self, lesson_id):
        lessonID = self.repo.get_lessons_by_id(lesson_id)
        if lessonID is None:
            raise HTTPException(status_code=404, detail="there is no lesson with this id")
        return lessonID

    def get_all_lessons(self):
        return self.repo.get_all_lessons()
    
    def create_lesson(self,title, description, content, language, difficulty, duration):
        createLesson = self.repo.create_lesson(title, description, content, language, difficulty, duration)
        return {"message" :"lessons created successfully"}
    
    def delete_lesson(self,lesson_id):
        lesson = self.repo.get_lessons_by_id(lesson_id)
        if lesson is None:
            raise HTTPException(status_code=404)
        delete = self.repo.delete_lesson(lesson_id)
        return{"message" :"lesson deleted "}
