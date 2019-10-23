INSERT INTO event_dates (id, date, location, event_id)
VALUES (1, '2019-11-11', '401 W Georgia St #600, Vancouver, BC V6B 5A1', 1),
(2, '2019-11-12', '999 Canada Pl, Vancouver, BC V6C 3T4', 2),
(3, '2019-11-13', '305 Water St, Vancouver, BC V6B 1B9', 3);

SELECT SETVAL('event_dates_id_seq', 50);