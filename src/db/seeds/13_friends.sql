INSERT INTO friends (id, is_accepted, user1_id, user2_id)
VALUES (1, TRUE, 1, 2),
(2, TRUE, 1, 3);

SELECT SETVAL('friends_id_seq', 50);
