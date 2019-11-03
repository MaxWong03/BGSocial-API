INSERT INTO event_dates (id, date, location, event_id, is_chosen)
VALUES (1, '2019-12-03 13:23:44', '401 W Georgia St #600, Vancouver, BC V6B 5A1', 1, TRUE),
(2, '2019-12-11 17:23:44', '999 Canada Pl, Vancouver, BC V6C 3T4', 2, FALSE),
(3, '2019-12-13 17:23:44', '888 Canada Pl, Vancouver, BC V6C 3T4', 2, FALSE),
(4, '2019-12-14 17:23:44', '777 Canada Pl, Vancouver, BC V6C 3T4', 2, FALSE),
(5, '2019-11-30 22:30:44', '305 Water St, Vancouver, BC V6B 1B9', 3, TRUE),
(6, '2019-12-12 13:00:44', '1234 W Georgia St #600, Vancouver, BC V6B 5A1', 4, TRUE),
(7, '2019-11-28 13:00:44', '401 W Georgia St #600, Vancouver, BC V6B 5A1', 1, FALSE);

SELECT SETVAL('event_dates_id_seq', 50);