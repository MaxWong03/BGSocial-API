INSERT INTO attendances (id, is_confirmed, attendant_id, event_id)
VALUES (1, TRUE, 1, 1),
(2, TRUE, 2, 1),
(3, true, 3, 1),
(4, true, 2, 2),
(5, true, 3, 2),
(6, false, 1, 3),
(7, true, 2, 3),
(8, false, 3, 3),
(9, true, 3, 4),
(10, true, 2, 4),
(11, true, 4, 4),
(12, false, 1, 5),
(13, false, 3, 5),
(14, false, 8, 5),
(15, false, 9, 5),

(16, false, 1, 6),
(17, true, 3, 6),
(18, true, 8, 6),
(19, true, 9, 6),

(20, true, 1, 7),
(21, true, 10, 7),
(22, true, 11, 7),
(23, true, 12, 7),

(24, true, 1, 8),
(25, true, 3, 8),
(26, true, 12, 8),
(27, true, 14, 8),

(28, false, 1, 2);

SELECT SETVAL('attendances_id_seq', 50);