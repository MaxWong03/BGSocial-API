INSERT INTO categories (id, name)
VALUES (1, 'Economic'),
(2, 'Fighting'),
(3, 'Science Fiction');

SELECT SETVAL('categories_id_seq', 50);