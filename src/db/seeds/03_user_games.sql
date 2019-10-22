INSERT INTO user_games (id, game_id, user_id)
VALUES (1, 1, 1),
(2, 2, 1),
(3, 3, 2);

SELECT SETVAL('user_games_id_seq', 50);