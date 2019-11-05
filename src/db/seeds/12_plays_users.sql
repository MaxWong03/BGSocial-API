INSERT INTO plays_users (score, is_winner, user_id, play_id)
VALUES 
(34, FALSE, 1, 1),
(2, FALSE, 1, 2),
(34, TRUE, 3, 3),
(10, FALSE, 1, 3),
(10, FALSE, 4, 7),
(45, FALSE, 5, 1),
(60, TRUE, 6, 1),
(66, FALSE, 7, 2),
(66, FALSE, 8, 2),
(67, TRUE, 9, 2),


(25, FALSE, 1, 4),
(30, FALSE, 2, 4),
(50, TRUE, 3, 4),

(65, FALSE, 1, 5),
(67, TRUE, 2, 5),
(60, FALSE, 4, 5),

(80, FALSE, 3, 6),
(81, FALSE, 5, 6),
(82, TRUE, 1, 6),

(56, FALSE, 1, 7),
(57, TRUE, 6, 7),
(56, FALSE, 7, 7),

(66, FALSE, 10, 10),
(67, FALSE, 10, 10),
(76, TRUE, 10, 10);

SELECT SETVAL('plays_users_id_seq', 50);