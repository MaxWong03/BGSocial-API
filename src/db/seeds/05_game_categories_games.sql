INSERT INTO game_categories_games (id, game_id, game_category_id)
VALUES (1, 2, 1),
(2, 1, 1),
(3, 2, 2);

SELECT SETVAL('game_categories_games_id_seq', 50);

