const fs = require('fs');

const getRandomScore = () => {
  min = Math.ceil(0);
  max = Math.floor(100);
  return Math.floor(Math.random() * (100 - 0 + 1)) + 0;
}

const getRandomUser = () => {
  min = Math.ceil(1);
  max = Math.floor(30);
  return Math.floor(Math.random() * (30 - 1 + 1)) + 1;
}

const getScoreArr = () => {
  return [getRandomScore(), getRandomScore(), getRandomScore(), getRandomScore(), getRandomScore()];
}

const getUniqueUserArr = () => {
  const userArr = [];
  while (userArr.length !== 5) {
    const randomUser = getRandomUser();
    if (!userArr.includes(randomUser)) userArr.push(randomUser);
  }
  return userArr;
}

const getWinningScore = (scoreArr) => {
  return Math.max(...scoreArr);
}

let sqlQuery = `INSERT INTO plays_users (score, is_winner, user_id, play_id)
VALUES
`;

for (let i = 1; i <= 100; i++) {
  const userArr = getUniqueUserArr();
  const scoreArr = getScoreArr();
  for (let j = 0; j < 5; j++) {
    const winningScore = getWinningScore(scoreArr);
    const score = scoreArr[j];
    const user = userArr[j];
    const isWinner = score === winningScore ? true : false;
    i === 100 && j === 4 ?
    sqlQuery += `(${score}, ${isWinner}, ${user}, ${i});\n`
    :
    sqlQuery += `(${score}, ${isWinner}, ${user}, ${i}),\n`
  }

} 

sqlQuery += "SELECT SETVAL('plays_users_id_seq', 550);"

fs.writeFileSync('./src/db/seeds/12_plays_users.sql', sqlQuery);