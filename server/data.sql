CREATE DATABASE tasktracker;

CREATE TABLE tasks (
    id VARCHAR (255) PRIMARY KEY,
    user_email VARCHAR (255),
    title VARCHAR (30),
    date VARCHAR (300)
);

CREATE TABLE users (
    email VARCHAR (255) PRIMARY KEY,
    hashed_password VARCHAR
);