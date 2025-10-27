CREATE TABLE IF NOT EXISTS users (
    id int primary key ,
    email varchar(255) not null,
    password_hash varchar(255) not null
    );