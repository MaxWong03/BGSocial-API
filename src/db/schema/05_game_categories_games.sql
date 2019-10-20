DROP TABLE IF EXISTS game_categories_games CASCADE;

CREATE TABLE game_categories_games (
  id SERIAL PRIMARY KEY NOT NULL,
  game_id INTEGER REFERENCES games(id) ON DELETE CASCADE,
  game_category_id INTEGER REFERENCES game_categories(id) ON DELETE CASCADE
);
