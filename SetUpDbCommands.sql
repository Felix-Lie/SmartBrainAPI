----------- Database set up -----------
-- terminal commands to create db
createdb 'smart-brain'

-- create table users
CREATE TABLE users(
	id SERIAL PRIMARY key,
	NAME VARCHAR(100),
	email TEXT UNIQUE NOT NULL,
	entries BIGINT DEFAULT 0,
	joined TIMESTAMP NOT NULL
)

-- create table login
CREATE TABLE login(
	id SERIAL PRIMARY key,
	hash VARCHAR(100) NOT NULL,
	email TEXT UNIQUE NOT NULL
)