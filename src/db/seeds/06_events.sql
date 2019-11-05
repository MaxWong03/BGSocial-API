INSERT INTO events (id, title, owner_id, spots)
VALUES (1, 'So cool games to play', 1, 4),
(2,'The awesome Board Game Day', 1, 5);


INSERT INTO events (id, owner_id, spots, is_open)
VALUES (3, 2, 10, FALSE),
(4, 3, 10, TRUE),
(5, 3, 5, FALSE),
(6, 3, 5, FALSE),
(7, 5, 5, FALSE),
(8, 7, 5, TRUE),
(9, 9, 5, FALSE),
(10, 10, 5, FALSE);


SELECT SETVAL('events_id_seq', 50);