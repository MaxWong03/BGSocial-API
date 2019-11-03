INSERT INTO event_games (game_id, event_id)
VALUES (1, 1),
(12, 1),
(22, 1),
(32, 1),
(15, 2),
(12, 3),
(25, 3),
(32, 3),
(2, 1),
(2, 2),
(10, 4),
(11, 4),
(12, 4),
(1, 3);

SELECT SETVAL('event_games_id_seq', 50);