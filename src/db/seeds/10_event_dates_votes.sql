INSERT INTO event_dates_votes (id, attendance_id, event_date_id)
VALUES (1, 1, 1),
(2, 2, 1),
(3, 1, 2),
(4, 2, 3),
(5, 3, 4),
(6, 1, 2),
(7, 2, 3),
(8, 3, 4);

SELECT SETVAL('event_dates_votes_id_seq', 50);

