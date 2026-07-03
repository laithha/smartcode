from app.api.database import get_cursor


class TipRepository:

    def get_tips_by_lesson_id(self, lesson_id):
        with get_cursor() as cursor:
            cursor.execute("SELECT tip_id, category, message FROM tips WHERE lesson_id = %s ORDER BY tip_id", (lesson_id,))
            return cursor.fetchall()
