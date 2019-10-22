DROP TABLE IF EXISTS event_dates_votes CASCADE;

CREATE TABLE event_dates_votes (
  id SERIAL PRIMARY KEY NOT NULL,
  attendance_id INTEGER REFERENCES attendances(id) ON DELETE CASCADE,
  event_date_id INTEGER REFERENCES event_dates(id) ON DELETE CASCADE
);