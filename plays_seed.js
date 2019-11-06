const fs = require('fs');

const getRandomMonth = () => {
  min = Math.ceil(1);
  max = Math.floor(12);
  return Math.floor(Math.random() * (12 - 1 + 1)) + 1;
}

const getRandomDay = () => {
  min = Math.ceil(1);
  max = Math.floor(25);
  return Math.floor(Math.random() * (25 - 1 + 1)) + 1;
}

const randomDate = () => {
  let month = getRandomMonth();
  let day = getRandomDay();
  month < 10 ? month = `0${month}` : month;
  day < 10 ? day = `0${day}` : day;
  return `2019-${month}-${day}`;
}

const getRandomHour = () => {
  min = Math.ceil(1);
  max = Math.floor(9);
  return Math.floor(Math.random() * (9 - 1 + 1)) + 1;
}

const getRandomMinute = () => {
  min = Math.ceil(10);
  max = Math.floor(59);
  return Math.floor(Math.random() * (59 - 10 + 1)) + 10;
}

const randomDuration = () => {
  return `${getRandomHour()}:${getRandomMinute()}:00`;
}

const randomGame = () => {
  min = Math.ceil(1);
  max = Math.floor(32);
  return Math.floor(Math.random() * (32 - 1 + 1)) + 1;
}

let sqlQuery = `
INSERT INTO plays (id, date, duration, game_id)
VALUES 
(1, '2019-08-13', '04:10:00', 1),
(2, '2019-10-13', '02:10:00', 1),
(3, '2019-08-21', '01:10:00', 1),
(4, '2019-07-13', '03:25:00', 2),
(5, '2019-08-17', '06:10:00', 2),
(6, '2019-11-09', '05:10:00', 3),
(7, '2019-09-11', '03:10:00', 3),
(8, '2019-10-11', '04:15:00', 3),
(9, '2019-09-09', '03:45:00', 3),
(10, '2019-10-11', '02:15:00', 2),
(11, '2019-07-13', '04:10:00', 1),
(12, '2019-05-13', '02:10:00', 2),
(13, '2019-04-21', '02:10:00', 3),
(14, '2019-03-13', '04:25:00', 4),
(15, '2019-05-17', '02:10:00', 5),
(16, '2019-11-09', '03:10:00', 6),
(17, '2019-08-11', '06:10:00', 7),
(18, '2019-12-11', '03:15:00', 8),
(19, '2019-07-09', '02:45:00', 9),
(20, '2019-07-11', '01:15:00', 10),
`;

for (let i = 21; i <= 50; i++) {
  i === 50 ?
    sqlQuery += `(${i}, '${randomDate()}', '${randomDuration()}', ${randomGame()});\n`
    :
    sqlQuery += `(${i}, '${randomDate()}', '${randomDuration()}', ${randomGame()}),\n`

}

sqlQuery += "SELECT SETVAL('plays_id_seq', 50);"

fs.writeFileSync('./src/db/seeds/11_plays.sql', sqlQuery);
