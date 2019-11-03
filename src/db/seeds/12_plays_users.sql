INSERT INTO plays_users (score, is_winner, user_id, play_id)
VALUES 
(34, TRUE, 1, 1),
(2, FALSE, 1, 2),
(10, TRUE, 3, 3),
(10, FALSE, 1, 3),
(10, FALSE, 4, 7),
(45, FALSE, 5, 1),
(40, TRUE, 6, 1),
(66, FALSE, 7, 2),
(66, FALSE, 8, 2),
(66, FALSE, 9, 2),
(66, FALSE, 10, 10);

SELECT SETVAL('plays_users_id_seq', 50);