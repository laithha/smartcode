CREATE TABLE IF NOT EXISTS lessons (
    lesson_id SERIAL PRIMARY KEY,
    title VARCHAR(100) NOT NULL,
    description TEXT,
    content TEXT,
    language VARCHAR(30),
    difficulty VARCHAR(20),
    duration INT
);
