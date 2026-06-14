import psycopg2
from app.api.database import db_lock

class SubmissionsRepository:
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

    def create_submission(self, user_id, lesson_id, code, language):
        self._write(
            "INSERT INTO submissions (user_id, lesson_id, code, language) VALUES (%s, %s, %s, %s)",
            (user_id, lesson_id, code, language)
        )

    def get_submissions_by_user_and_lesson(self, user_id, lesson_id):
        with db_lock:
            self.cursor.execute(
                "SELECT submission_id, code, language, submitted_at FROM submissions WHERE user_id = %s AND lesson_id = %s ORDER BY submitted_at DESC",
                (user_id, lesson_id)
            )
            return self.cursor.fetchall()
