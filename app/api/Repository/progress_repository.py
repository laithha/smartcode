import psycopg2

class ProgressRepository:
    def __init__(self, db_connection):
        self.db = db_connection
        self.cursor = self.db.cursor()

    def get_progress_by_id(self,user_id):
        self.cursor.execute("select * from progress where user_id = %s", (user_id,))
        return self.cursor.fetchall()
