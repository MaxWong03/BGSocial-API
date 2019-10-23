INSERT INTO events (id, owner_id)
VALUES (1, 1),
(2, 1),
(3, 2);

SELECT SETVAL('events_id_seq', 50);