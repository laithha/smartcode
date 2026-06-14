import psycopg2
from app.api.database import db_lock

class TipRepository:
    def __init__(self,db_connection ):
        self.db = db_connection
        self.cursor = self.db.cursor()


    def get_tips_by_lesson_id(self, lesson_id):
        with db_lock:
            self.cursor.execute("SELECT tip_id, category, message FROM tips WHERE lesson_id = %s", (lesson_id,))
            return self.cursor.fetchall()