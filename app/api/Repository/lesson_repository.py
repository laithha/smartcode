import psycopg2
from app.api.database import db_lock


class LessonRepository:
    def __init__(self, db_connection):
        self.db = db_connection
        self.cursor = self.db.cursor()

    def _write(self, query, params):
        # Run a write and commit; roll back on failure so the shared connection
        # is never left in an aborted-transaction state.
        with db_lock:
            try:
                self.cursor.execute(query, params)
                self.db.commit()
            except Exception:
                self.db.rollback()
                raise

    def get_lessons_by_id(self, lesson_id):
        with db_lock:
            self.cursor.execute("select * from lessons where lesson_id = %s", (lesson_id,))
            return self.cursor.fetchone()

    def get_all_lessons(self):
        with db_lock:
            self.cursor.execute("select * from lessons")
            return self.cursor.fetchall()

    def count_lessons(self):
        with db_lock:
            self.cursor.execute("select COUNT(*) from lessons")
            return self.cursor.fetchone()

    def create_lesson(self,title,description, content, language, difficulty, duration):
        self._write("insert into lessons(title, description,content, language, difficulty, duration) values(%s,%s,%s,%s,%s,%s)", (title, description, content, language, difficulty, duration))

    def delete_lesson(self,lesson_id):
        self._write("delete from lessons where lesson_id=%s", (lesson_id,))