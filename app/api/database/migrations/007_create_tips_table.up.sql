CREATE TABLE IF NOT EXISTS tips (
    tip_id SERIAL PRIMARY KEY,
    lesson_id INT REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    category VARCHAR(50),
    message TEXT
);
