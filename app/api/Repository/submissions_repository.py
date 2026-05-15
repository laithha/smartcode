import psycopg2

class SubmissionsRepository:
    def __init__(self, db_connection):
        self.db = db_connection
        self.cursor = self.db.cursor()

    def create_submission(self, user_id, lesson_id, code, language):
        self.cursor.execute(
            "INSERT INTO submissions (user_id, lesson_id, code, language) VALUES (%s, %s, %s, %s)",
            (user_id, lesson_id, code, language)
        )
        self.db.commit()

    def get_submissions_by_user_and_lesson(self, user_id, lesson_id):
        self.cursor.execute(
            "SELECT submission_id, code, language, submitted_at FROM submissions WHERE user_id = %s AND lesson_id = %s ORDER BY submitted_at DESC",
            (user_id, lesson_id)
        )
        return self.cursor.fetchall()
