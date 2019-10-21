INSERT INTO game_categories (id, game_id, category_id)
VALUES (1, 2, 1),
(2, 1, 1),
(3, 2, 2);

SELECT SETVAL('game_categories_id_seq', 50);

