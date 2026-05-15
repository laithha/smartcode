import psycopg2

class LeaderboardRepository:
    def __init__(self, db_connection):
        self.db = db_connection
        self.cursor = self.db.cursor() 

    def get_leaderboard(self):
        self.cursor.execute("""
            SELECT u.id, COALESCE(u.username, split_part(u.email, '@', 1)), COUNT(p.progress_id) as completed_count
            FROM users u
            LEFT JOIN progress p ON u.id = p.user_id AND p.status = 'completed'
            WHERE u.show_on_leaderboard = TRUE
            GROUP BY u.id, u.username, u.email
            ORDER BY completed_count DESC
        """)
        return self.cursor.fetchall()
