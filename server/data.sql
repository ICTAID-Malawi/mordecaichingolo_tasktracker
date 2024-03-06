CREATE DATABASE tasktracker3;

CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    user_name VARCHAR(255) NOT NULL,
    hashed_password VARCHAR(255) NOT NULL
);

CREATE TABLE tasks (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    progress INT CHECK (progress >= 0 AND progress <= 100),
    start_date DATE NOT NULL,
    finish_date DATE NOT NULL,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

CREATE TABLE activities (
    id SERIAL PRIMARY KEY,
    task_id INTEGER REFERENCES tasks(id),
    title VARCHAR(100) NOT NULL,
    description TEXT,
    activity_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id) REFERENCES tasks(id)
);
