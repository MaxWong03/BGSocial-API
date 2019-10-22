INSERT INTO plays_users (id, score, is_winner, user_id, play_id)
VALUES (1, 34, TRUE, 1, 1),
(2, 45, FALSE, 2, 1),
(3, 33, FALSE, 1, 2),
(4, 40, TRUE, 2, 1),
(5, 66, FALSE, 1, 2);

SELECT SETVAL('plays_users_id_seq', 50);
