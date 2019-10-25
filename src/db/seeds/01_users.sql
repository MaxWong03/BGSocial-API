INSERT INTO users (id, fb_id, name, nickname, email, avatar)
VALUES (1, 921623601546635, 'Max Wong', 'Mad Max', 'maxwong93@gmail.com', ' https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=921623601546635&height=350&width=350&ext=1574626882&hash=AeSZ-ILZTTrn2hrH'),
(2, 2184479695188878, 'Zongxi Li', 'Jessie', 'zongxi@gmail.com', 'https://platform-lookaside.fbsbx.com/platform/profilepic/?asid=2184479695188878&height=350&width=350&ext=1574626952&hash=AeS_rrrvqq3FXxd6'),
(3, 123, 'Camilia Riveria', 'CR', 'cr@gmail.com', 'https://images.pexels.com/photos/2078875/pexels-photo-2078875.jpeg');

SELECT SETVAL('users_id_seq', 50);


