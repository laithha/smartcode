import psycopg2

class ProgressRepository:
    def __init__(self, db_connection):
        self.db = db_connection
        self.cursor = self.db.cursor()

    def get_progress_by_id(self,user_id):
        self.cursor.execute("select * from progress where user_id = %s", (user_id,))
        return self.cursor.fetchall()

    def create_progress(self, user_id, lesson_id, status):
        try:
            self.cursor.execute("insert into progress(user_id, lesson_id, status) values (%s,%s,%s)", (user_id, lesson_id, status))
            return self.db.commit()
        except Exception as e:
            self.db.rollback()                                                                                                                                                                                 
            raise e 