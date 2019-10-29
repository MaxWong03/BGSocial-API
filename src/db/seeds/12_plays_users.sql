INSERT INTO plays_users (score, is_winner, user_id, play_id)
VALUES 
(34, TRUE, 1, 1),
-- the following 2 are the opposite cases for the 1st case
(2, FALSE, 1, 2),
(10, FALSE, 1, 3),
(10, FALSE, 1, 7),
(45, FALSE, 2, 1),
(40, TRUE, 3, 1),
(66, FALSE, 3, 2),
(66, FALSE, 3, 2),
(66, FALSE, 3, 2),
(66, FALSE, 1, 10);

SELECT SETVAL('plays_users_id_seq', 50);