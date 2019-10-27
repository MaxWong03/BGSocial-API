DROP TABLE IF EXISTS users CASCADE;

CREATE TABLE users (
  id SERIAL PRIMARY KEY NOT NULL,
  fb_id BIGINT NOT NULL,
  name VARCHAR(255) NOT NULL,
  nickname VARCHAR(255),
  email VARCHAR(255) NOT NULL,
  -- password VARCHAR(255) NOT NULL, Don't need password because we are using fb to login
  avatar VARCHAR(255)
);