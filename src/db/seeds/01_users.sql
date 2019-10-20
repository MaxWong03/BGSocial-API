INSERT INTO users (id, name, nickname, email, password, avatar)
VALUES (1, 'Armand Hilll', 'Armand111', 'lera_hahn@dickens.org', 'password', 'https://cdn3.iconfinder.com/data/icons/dogs-outline/100/dog-04-512.png'),
(2, 'Pablo Soto', 'Pablito', 'pablo_soto@dickens.org', 'password', 'https://images.pexels.com/photos/1612351/pexels-photo-1612351.jpeg'),
(3, 'Elliot Dickinson', 'El44', 'derrick_pollich@gmail.com', 'password', 'https://images.pexels.com/photos/2078875/pexels-photo-2078875.jpeg');

SELECT SETVAL('users_id_seq', 50);


