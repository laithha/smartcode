import psycopg2
from psycopg2 import pool
import os
import time
from contextlib import contextmanager
from dotenv import load_dotenv

load_dotenv()

# If every connection is busy, wait up to this many seconds for one to free up
# before giving up (instead of failing instantly with "pool exhausted").
_POOL_WAIT_TIMEOUT = 10

# A pool of ready database connections. Each request checks out its OWN
# connection, uses it, and returns it — so requests run in parallel safely
# without sharing a single connection (which is why no lock is needed).
try:
    connection_pool = pool.ThreadedConnectionPool(
        minconn=2,
        maxconn=20,
        host="localhost",
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        port=5432,
    )
except psycopg2.OperationalError as e:
    raise RuntimeError(
        "Could not connect to the database. Is the Postgres container running "
        "(docker compose up -d) and are POSTGRES_* set in .env?"
    ) from e


def _getconn_blocking():
    """Get a connection from the pool. If the pool is momentarily exhausted,
    wait for one to be returned rather than failing instantly. Safe because
    every connection is held only for a single short query and always returned,
    so a free one always becomes available quickly."""
    start = time.monotonic()
    while True:
        try:
            return connection_pool.getconn()
        except pool.PoolError:
            if time.monotonic() - start > _POOL_WAIT_TIMEOUT:
                raise
            time.sleep(0.02)


@contextmanager
def get_cursor(commit=False):
    """Borrow a connection from the pool and yield a cursor.

    On success: commit if this was a write, otherwise close the read
    transaction cleanly. On error: roll back. Either way, the connection is
    always returned to the pool so it can be reused.
    """
    conn = _getconn_blocking()
    cursor = conn.cursor()
    try:
        yield cursor
        if commit:
            conn.commit()
        else:
            conn.rollback()
    except Exception:
        conn.rollback()
        raise
    finally:
        cursor.close()
        connection_pool.putconn(conn)
