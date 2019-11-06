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
const scoreArray = [getRandomScore(), getRandomScore(), getRandomScore(), getRandomScore(), getRandomScore()];

console.log(getRandomUser());



// let sqlQuery = `INSERT INTO plays_users (score, is_winner, user_id, play_id)
// VALUES
// (34, FALSE, 1, 1),
// (2, FALSE, 1, 2),
// (34, TRUE, 3, 3),
// (10, FALSE, 1, 3),
// (10, FALSE, 4, 7),
// (45, FALSE, 5, 1),
// (60, TRUE, 6, 1),
// (66, FALSE, 7, 2),
// (66, FALSE, 8, 2),
// (67, TRUE, 9, 2),
// (25, FALSE, 1, 4),
// (30, FALSE, 2, 4),
// (50, TRUE, 3, 4),
// (65, FALSE, 1, 5),
// (67, TRUE, 2, 5),
// (60, FALSE, 4, 5),
// (80, FALSE, 3, 6),
// (81, FALSE, 5, 6),
// (82, TRUE, 1, 6),
// (56, FALSE, 1, 7),
// (57, TRUE, 6, 7),
// (56, FALSE, 7, 7),
// (66, FALSE, 10, 10),
// (67, FALSE, 10, 10),
// (76, TRUE, 10, 10);
// `;



// fs.writeFileSync('./src/db/seeds/fake-plays-users.sql', sqlQuery);