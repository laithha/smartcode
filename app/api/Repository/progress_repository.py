from app.api.database import get_cursor


class ProgressRepository:

    def get_progress_by_id(self, user_id):
        with get_cursor() as cursor:
            cursor.execute("SELECT progress.progress_id, progress.status, lessons.title, lessons.language, lessons.difficulty, lessons.lesson_id FROM progress INNER JOIN lessons ON progress.lesson_id = lessons.lesson_id WHERE progress.user_id = %s", (user_id,))
            return cursor.fetchall()

    def create_progress(self, user_id, lesson_id, status):
        with get_cursor(commit=True) as cursor:
            cursor.execute("insert into progress(user_id, lesson_id, status, completed_at) values (%s,%s,%s,NOW())", (user_id, lesson_id, status))

    def get_progress_by_user_and_lesson(self, user_id, lesson_id):
        with get_cursor() as cursor:
            cursor.execute("select * from progress where user_id = %s and lesson_id = %s", (user_id, lesson_id))
            return cursor.fetchone()

    def get_completed_dates(self, user_id):
        with get_cursor() as cursor:
            cursor.execute("SELECT DATE(completed_at) FROM progress WHERE user_id = %s ORDER BY completed_at DESC", (user_id,))
            return cursor.fetchall()

    def get_recommendation(self, user_id):
        with get_cursor() as cursor:
            cursor.execute("""
                SELECT * FROM lessons
                WHERE lesson_id NOT IN (
                    SELECT lesson_id FROM progress WHERE user_id = %s
                )
                ORDER BY
                    -- Lessons that come AFTER the furthest one the user has reached
                    -- sort first (FALSE < TRUE), so we keep moving forward in the
                    -- curriculum; only once nothing is left ahead do we fall back
                    -- to earlier skipped lessons. lesson_id is the curriculum order.
                    (lesson_id <= (SELECT COALESCE(MAX(lesson_id), 0) FROM progress WHERE user_id = %s)),
                    lesson_id
                LIMIT 1
            """, (user_id, user_id))
            return cursor.fetchone()
