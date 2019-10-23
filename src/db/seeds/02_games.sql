


INSERT INTO games (id, name, DESCRIPTION, year_published, age, play_time_min, play_time_max, bgg_id, average_bgg_rating, thumbnail, image, category, mechanic)
VALUES (1, 'Gloomhaven', 'Cephalofair Games', 2, 89, 'https://cf.geekdo-images.com/imagepagezoom/img/gmW4WxIHPcffwAS-L2LTg6cFiLo=/fit-in/1200x900/filters:no_upscale()/pic2437871.jpg'),
(2, 'Terraforming Mars', 'FryxGames', 12, 84, 'https://cf.geekdo-images.com/imagepagezoom/img/SIj25CRpU-wy-PN4b4Cc6gjlmI4=/fit-in/1200x900/filters:no_upscale()/pic3536616.jpg'),
(3, 'Scythe', 'Stonemaier Games', 15, 83, 'https://cf.geekdo-images.com/imagepagezoom/img/HSxPiVP8vEAWAEn2F3yYnNOKuBs=/fit-in/1200x900/filters:no_upscale()/pic3163924.jpg');


SELECT SETVAL('games_id_seq', 50);

