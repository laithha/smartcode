import psycopg2

class TipRepository:
    def __init__(self,db_connection ):
        self.db = db_connection
        self.cursor = self.db.cursor()

    
    def get_tips_by_lesson_id(self, lesson_id):
        self.cursor.execute("SELECT tip_id, category, message FROM tips WHERE lesson_id = %s", (lesson_id,))
        return self.cursor.fetchall()