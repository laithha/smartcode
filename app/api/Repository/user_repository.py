import psycopg2
from app.api.database import db_lock

class UserRepository:

    def __init__(self, db_connection):
        self.db = db_connection
        self.cursor = self.db.cursor()

    def _write(self, query, params):
        # Run a write (INSERT/UPDATE/DELETE) and commit. If it fails, roll the
        # transaction back so the shared connection stays usable for the next request.
        with db_lock:
            try:
                self.cursor.execute(query, params)
                self.db.commit()
            except Exception:
                self.db.rollback()
                raise

    def get_user_by_id(self, id):
        with db_lock:
            self.cursor.execute("SELECT * FROM users WHERE id = %s", (id,))
            return self.cursor.fetchone()

    def get_all_users(self):
        with db_lock:
            self.cursor.execute("select * from users")
            return self.cursor.fetchall()

    def get_user_by_email(self,email):
        with db_lock:
            self.cursor.execute("select * from users where email = %s", (email,))
            return self.cursor.fetchone()
    
    def create_user(self, email, password):
        self._write("insert into users (email, password_hash) values(%s, %s)", (email, password))

    def update_user_admin_status(self,user_id, is_admin):
        self._write("update users set is_admin = %s where id = %s", (is_admin, user_id))

    def delete_user(self,user_id):
        self._write("delete from users where id =%s", (user_id,))

    def set_verification_code(self, email, code, expires):
        self._write(
            "UPDATE users SET verification_code = %s, verification_expires = %s WHERE email = %s",
            (code, expires, email)
        )

    def get_verification_info(self, email):
        with db_lock:
            self.cursor.execute(
                "SELECT verification_code, verification_expires FROM users WHERE email = %s",
                (email,)
            )
            return self.cursor.fetchone()

    def mark_user_verified(self, email):
        self._write(
            "UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_expires = NULL WHERE email = %s",
            (email,)
        )

    def update_password(self, email, new_hashed_password):
        self._write(
            "UPDATE users SET password_hash = %s, verification_code = NULL, verification_expires = NULL WHERE email = %s",
            (new_hashed_password, email)
        )

    def update_username(self, user_id, username):
        self._write(
            "UPDATE users SET username = %s WHERE id = %s",
            (username, user_id)
        )

    def update_leaderboard_visibility(self, user_id, show_on_leaderboard):
        self._write(
            "UPDATE users SET show_on_leaderboard = %s WHERE id = %s",
            (show_on_leaderboard, user_id)
        )

    def get_leaderboard_visibility(self, user_id):
        with db_lock:
            self.cursor.execute(
                "SELECT show_on_leaderboard FROM users WHERE id = %s",
                (user_id,)
            )
            row = self.cursor.fetchone()
            return row[0] if row else None
