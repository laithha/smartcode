import threading
import time

from app.api.Repository.lesson_repository import LessonRepository
from app.api.Repository.user_repository import UserRepository
from app.api.Repository.progress_repository import ProgressRepository
from app.api.Repository.leaderboard_repository import LeaderboardRepository
from app.api.database import get_cursor

lessons = LessonRepository()
users = UserRepository()
progress = ProgressRepository()
leaderboard = LeaderboardRepository()


def test_concurrent_reads():
    errors = []

    def one_user():
        try:
            for _ in range(3):
                lessons.get_all_lessons()
                users.get_all_users()
                progress.get_completed_dates(21)
                leaderboard.get_leaderboard()
        except Exception as e:
            errors.append(repr(e))

    threads = [threading.Thread(target=one_user) for _ in range(50)]
    start = time.time()
    for t in threads:
        t.start()
    for t in threads:
        t.join()
    elapsed = time.time() - start

    total_ops = 50 * 3 * 4
    print(f"TEST 1 - concurrent reads: {total_ops} queries by 50 users at once")
    print(f"         finished in {elapsed:.2f}s with {len(errors)} errors")
    return len(errors) == 0


def test_write():
    users.update_leaderboard_visibility(21, True)
    saved = users.get_leaderboard_visibility(21)
    users.update_leaderboard_visibility(21, False)
    print(f"TEST 2 - write/commit: value saved correctly = {saved is True}")
    return saved is True


def test_error_recovery():
    try:
        with get_cursor() as cur:
            cur.execute("SELECT * FROM this_table_does_not_exist")
    except Exception:
        pass

    still_works = len(users.get_all_users()) >= 0
    print(f"TEST 3 - error recovery: next query works after a failure = {still_works}")
    return still_works


if __name__ == "__main__":
    results = [test_concurrent_reads(), test_write(), test_error_recovery()]
    print("-" * 55)
    print("RESULT:", "ALL TESTS PASSED" if all(results) else "SOME TESTS FAILED")
