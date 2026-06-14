import psycopg2
import os
import threading
from dotenv import load_dotenv

load_dotenv()

db_lock = threading.Lock()

try:
    conn = psycopg2.connect(
        host="localhost",
        dbname=os.getenv("POSTGRES_DB"),
        user=os.getenv("POSTGRES_USER"),
        password=os.getenv("POSTGRES_PASSWORD"),
        port=5432
    )
except psycopg2.OperationalError as e:
    raise RuntimeError(
        "Could not connect to the database. Is the Postgres container running "
        "(docker compose up -d) and are POSTGRES_* set in .env?"
    ) from e
