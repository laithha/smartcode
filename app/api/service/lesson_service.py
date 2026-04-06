from app.api.Repository.lesson_repository import LessonRepository

class LessonService:
    def __init__(self, repo:LessonRepository):
        self.repo  = repo

    def get_lesson_by_id(self, lesson_id):
        lessonID = self.repo.get_lessons_by_id(lesson_id)
        if lessonID is None:
            raise Exception("there is no lesson with this id")
        return lessonID
    
    def get_all_lessons(self):
        lessons = self.repo.get_all_lessons()
        if lessons is None:
            raise Exception("there are no lessons")
        return lessons