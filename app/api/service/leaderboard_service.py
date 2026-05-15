from app.api.Repository.leaderboard_repository import LeaderboardRepository

class LeaderboardService:
    def __init__(self, repo: LeaderboardRepository):
        self.repo = repo

    def get_leaderboard(self):
        rows = self.repo.get_leaderboard()
        return [
            {"rank": i + 1, "user_id": row[0], "display_name": row[1], "completed_count": row[2]}
            for i, row in enumerate(rows)
        ]
