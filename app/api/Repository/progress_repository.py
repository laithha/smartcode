import psycopg2

class ProgressRepository:
    def __init__(self, db_connection):
        self.db = db_connection
        self.cursor = self.db.cursor()

    def get_progress_by_id(self,user_id):
        self.cursor.execute("SELECT progress.progress_id, progress.status, lessons.title, lessons.language, lessons.difficulty, lessons.lesson_id FROM progress INNER JOIN lessons ON progress.lesson_id = lessons.lesson_id WHERE progress.user_id = %s", (user_id,))
        return self.cursor.fetchall()

    def create_progress(self, user_id, lesson_id, status):
        try:
            self.cursor.execute("insert into progress(user_id, lesson_id, status, completed_at) values (%s,%s,%s,NOW())", (user_id, lesson_id, status))
            return self.db.commit()
        except Exception as e:
            self.db.rollback()                                                                                                                                                                                 
            raise e 
        
    def get_progress_by_user_and_lesson(self,user_id, lesson_id):
        self.cursor.execute("select * from progress where user_id = %s and lesson_id = %s", (user_id, lesson_id))
        return self.cursor.fetchone()
    
    def get_completed_dates(self, user_id):
        self.cursor.execute("SELECT DATE(completed_at) FROM progress WHERE user_id = %s ORDER BY completed_at DESC",(user_id,))
        return self.cursor.fetchall()
    
                                                                                                                                                                                                       
    def get_recommendation(self, user_id):
        self.cursor.execute("""
            SELECT * FROM lessons
            WHERE lesson_id NOT IN (
                SELECT lesson_id FROM progress WHERE user_id = %s
            )
            ORDER BY
                CASE difficulty                                                                                                                                                                                              
                    WHEN 'beginner' THEN 1
                    WHEN 'intermediate' THEN 2
                    WHEN 'advanced' THEN 3
                END
            LIMIT 1
        """, (user_id,))
        return self.cursor.fetchone()