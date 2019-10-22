DROP TABLE IF EXISTS plays CASCADE;

CREATE TABLE plays (
  id SERIAL PRIMARY KEY NOT NULL,
  date DATE,
  duration TIME,
  game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE
);