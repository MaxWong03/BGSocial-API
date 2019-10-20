INSERT INTO event_games (id, game_id, event_id)
VALUES (1, 1, 1),
(2, 2, 1);

SELECT SETVAL('event_games_id_seq', 50);
