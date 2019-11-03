INSERT INTO events (id, owner_id, spots)
VALUES (1, 1, 4),
(2, 1, 5);


INSERT INTO events (id, owner_id, spots, is_open)
VALUES (3, 2, 10, FALSE),
(4, 3, 10, TRUE);


SELECT SETVAL('events_id_seq', 50);