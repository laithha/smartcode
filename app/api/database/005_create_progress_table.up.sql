CREATE TABLE IF NOT EXISTS progress (
    progress_id SERIAL PRIMARY KEY,
    user_id INT REFERENCES users(id) ON DELETE CASCADE,
    lesson_id INT REFERENCES lessons(lesson_id) ON DELETE CASCADE,
    status VARCHAR(20) DEFAULT 'not_started'
);
