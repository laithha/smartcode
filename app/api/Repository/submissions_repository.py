from app.api.database import get_cursor


class SubmissionsRepository:

    def _write(self, query, params):
        with get_cursor(commit=True) as cursor:
            cursor.execute(query, params)

    def create_submission(self, user_id, lesson_id, code, language):
        self._write(
            "INSERT INTO submissions (user_id, lesson_id, code, language) VALUES (%s, %s, %s, %s)",
            (user_id, lesson_id, code, language)
        )

    def get_submissions_by_user_and_lesson(self, user_id, lesson_id):
        with get_cursor() as cursor:
            cursor.execute(
                "SELECT submission_id, code, language, submitted_at FROM submissions WHERE user_id = %s AND lesson_id = %s ORDER BY submitted_at DESC",
                (user_id, lesson_id)
            )
            return cursor.fetchall()
