INSERT INTO event_dates_votes (id, attendance_id, event_date_id)
VALUES (1, 1, 1),
(2, 2, 1);

SELECT SETVAL('event_dates_votes_id_seq', 50);

