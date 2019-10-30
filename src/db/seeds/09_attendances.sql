INSERT INTO attendances (id, is_confirmed, attendant_id, event_id)
VALUES (1, TRUE, 1, 1),
(2, TRUE, 2, 1),
(3, true, 3, 1),
(4, true, 2, 2),
(5, true, 3, 2),
(6, false, 1, 3),
(7, true, 2, 3),
(8, false, 3, 3),
(9, false, 1, 2);

SELECT SETVAL('attendances_id_seq', 50);