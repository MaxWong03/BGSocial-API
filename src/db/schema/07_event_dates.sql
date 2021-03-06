DROP TABLE IF EXISTS event_dates CASCADE;

CREATE TABLE event_dates (
  id SERIAL PRIMARY KEY NOT NULL,
  is_chosen BOOLEAN NOT NULL DEFAULT FALSE,
  date TIMESTAMP NOT NULL,
  location VARCHAR(255) NOT NULL,
  event_id INTEGER REFERENCES events(id) ON DELETE CASCADE
);