import psycopg2

conn = psycopg2.connect(
    host="localhost",
    dbname="db_smartcode",
    user="admin",
    password="admin",
    port=5432
)
