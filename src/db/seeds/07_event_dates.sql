INSERT INTO event_dates (id, date, location, event_id, is_chosen)
VALUES (1, '2019-12-03 13:23:44', '401 W Georgia St #600, Vancouver, BC V6B 5A1', 1, TRUE),
(2, '2019-12-11 17:23:44', '999 Canada Pl', 2, FALSE),
(3, '2019-12-13 17:23:44', '888 Canada Pl', 2, FALSE),
(4, '2019-12-14 17:23:44', '777 Canada Pl', 2, FALSE),
(5, '2019-11-30 22:30:44', '305 Water St', 3, TRUE),
(6, '2019-12-12 13:00:44', '1234 W Georgia St #600', 4, TRUE),
(7, '2019-11-28 13:00:44', '401 W Georgia St #600', 1, FALSE),
(8, '2020-01-16 15:00:44', '401 W Georgia St #600', 5, FALSE),
(9, '2020-01-15 18:00:44', '401 W Georgia St #600', 5, FALSE),

(10, '2019-12-28 13:00:44', '567 Green St #456', 8, FALSE),
(11, '2019-12-03 15:00:44', '344 Blue St #768', 8, TRUE),
(12, '2019-12-15 18:00:44', '4100 White St #788', 8, FALSE),

(13, '2019-12-01 13:00:44', '401 W Georgia St #600', 7, TRUE),
(14, '2019-12-16 15:00:44', '401 W Georgia St #600', 7, FALSE),
(15, '2019-12-15 18:00:44', '401 W Georgia St #600', 7, FALSE),

(16, '2018-11-28 13:00:44', '401 W Georgia St #600', 6, FALSE),
(17, '2018-12-16 15:00:44', '401 W Georgia St #600', 6, TRUE),
(18, '2018-11-15 18:00:44', '401 W Georgia St #600', 6, FALSE),

(19, '2020-01-13 13:00:44', '401 W Georgia St #600', 5, FALSE);

SELECT SETVAL('event_dates_id_seq', 50);