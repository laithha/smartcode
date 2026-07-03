from app.api.database import get_cursor


class LessonRepository:

    def _write(self, query, params):
        with get_cursor(commit=True) as cursor:
            cursor.execute(query, params)

    def get_lessons_by_id(self, lesson_id):
        with get_cursor() as cursor:
            cursor.execute("select * from lessons where lesson_id = %s", (lesson_id,))
            return cursor.fetchone()

    def get_all_lessons(self):
        with get_cursor() as cursor:
            cursor.execute("select * from lessons")
            return cursor.fetchall()

    def count_lessons(self):
        with get_cursor() as cursor:
            cursor.execute("select COUNT(*) from lessons")
            return cursor.fetchone()

    def create_lesson(self, title, description, content, language, difficulty, duration):
        self._write("insert into lessons(title, description,content, language, difficulty, duration) values(%s,%s,%s,%s,%s,%s)", (title, description, content, language, difficulty, duration))

    def delete_lesson(self, lesson_id):
        self._write("delete from lessons where lesson_id=%s", (lesson_id,))
