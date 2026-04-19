import psycopg2


class LessonRepository:
    def __init__(self, db_connection):
        self.db = db_connection
        self.cursor = self.db.cursor()

    def get_lessons_by_id(self, lesson_id):
        self.cursor.execute("select * from lessons where lesson_id = %s", (lesson_id,))
        return self.cursor.fetchone()
    
    def get_all_lessons(self):
        self.cursor.execute("select * from lessons")
        return self.cursor.fetchall()
    
    def count_lessons(self):
        self.cursor.execute("select COUNT(*) from lessons")
        return self.cursor.fetchone()

    def create_lesson(self,title,description, content, language, difficulty, duration):
        self.cursor.execute("insert into lessons(title, description,content, language, difficulty, duration) values(%s,%s,%s,%s,%s,%s)", (title, description, content, language, difficulty, duration))
        return self.db.commit()
    
    def delete_lesson(self,lesson_id):
        self.cursor.execute("delete from lessons where lesson_id=%s", (lesson_id,))
        return self.db.commit()