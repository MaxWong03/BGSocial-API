DROP TABLE IF EXISTS games CASCADE;

CREATE TABLE games (
  id SERIAL PRIMARY KEY NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  year_published INTEGER,
  age INTEGER,
  play_time_min INTEGER,
  play_time_max INTEGER,
  bgg_id INTEGER NOT NULL,
  average_bgg_rating DOUBLE PRECISION,
  thumbnail VARCHAR(255),
  image VARCHAR(255),
  category VARCHAR(255),
  mechanic VARCHAR(255)
);