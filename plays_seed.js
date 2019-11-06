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
`;

for (let i = 1; i <= 100; i++) {
  i === 100 ?
    sqlQuery += `(${i}, '${randomDate()}', '${randomDuration()}', ${randomGame()});\n`
    :
    sqlQuery += `(${i}, '${randomDate()}', '${randomDuration()}', ${randomGame()}),\n`

}

sqlQuery += "SELECT SETVAL('plays_id_seq', 101);"

fs.writeFileSync('./src/db/seeds/11_plays.sql', sqlQuery);
