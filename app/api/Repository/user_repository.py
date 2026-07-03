from app.api.database import get_cursor


class UserRepository:

    def _write(self, query, params):
        with get_cursor(commit=True) as cursor:
            cursor.execute(query, params)

    def get_user_by_id(self, id):
        with get_cursor() as cursor:
            cursor.execute("SELECT * FROM users WHERE id = %s", (id,))
            return cursor.fetchone()

    def get_all_users(self):
        with get_cursor() as cursor:
            cursor.execute("select * from users")
            return cursor.fetchall()

    def get_user_by_email(self, email):
        with get_cursor() as cursor:
            cursor.execute("select * from users where email = %s", (email,))
            return cursor.fetchone()

    def create_user(self, email, password):
        self._write("insert into users (email, password_hash) values(%s, %s)", (email, password))

    def update_user_admin_status(self, user_id, is_admin):
        self._write("update users set is_admin = %s where id = %s", (is_admin, user_id))

    def delete_user(self, user_id):
        self._write("delete from users where id =%s", (user_id,))

    def set_verification_code(self, email, code, expires):
        self._write(
            "UPDATE users SET verification_code = %s, verification_expires = %s WHERE email = %s",
            (code, expires, email)
        )

    def get_verification_info(self, email):
        with get_cursor() as cursor:
            cursor.execute(
                "SELECT verification_code, verification_expires FROM users WHERE email = %s",
                (email,)
            )
            return cursor.fetchone()

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
        with get_cursor() as cursor:
            cursor.execute(
                "SELECT show_on_leaderboard FROM users WHERE id = %s",
                (user_id,)
            )
            row = cursor.fetchone()
            return row[0] if row else None
