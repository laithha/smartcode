import psycopg2

class UserRepository:

    def __init__(self, db_connection):
        self.db = db_connection
        self.cursor = self.db.cursor()
    
    def get_user_by_id(self, id):
        self.cursor.execute("SELECT * FROM users WHERE id = %s", (id,))
        return self.cursor.fetchone()
    
    def get_all_users(self):
        self.cursor.execute("select * from users")
        return self.cursor.fetchall()
    
    def get_user_by_email(self,email):
        self.cursor.execute("select * from users where email = %s", (email,))
        return self.cursor.fetchone()
    
    def create_user(self, email, password):
        self.cursor.execute("insert into users (email, password_hash) values(%s, %s)", (email, password))
        return self.db.commit()