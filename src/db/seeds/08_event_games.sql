INSERT INTO event_games (id, game_id, event_id)
VALUES (1, 1, 1),
(2, 12, 1),
(3, 22, 1),
(4, 32, 1),
(5, 15, 2),
(6, 12, 3),
(7, 25, 3),
(8, 32, 3),
(9, 32, 1),
(10, 2, 1),
(11, 2, 2),
(12, 1, 3);

SELECT SETVAL('event_games_id_seq', 50);