const pg = require("pg");

const getAllGamesFromDB = function (db) {
  return db.query(`SELECT * FROM games`)
    .then(res => res.rows);
};

const getOnePublicGameByGameID = function (db, gameID) {
  return db.query(`SELECT * FROM games WHERE games.id = $1`, [gameID])
    .then(res => res.rows);
};

const getOneGameByGameName = function (db, gameName) {
  return db.query(`SELECT * FROM games WHERE games.name = $1`, [gameName])
    .then(res => res.rows);
};

// get a list of games based on the category name
const getAllGamesByCategoryID = function (db, categoryid) {
  return db.query(`SELECT * FROM game_categories WHERE categories.id = ${categoryid}`)
    .then(res => res.rows);
};

// get a list of games owned by one user based on the User id
const getAllGamesByUserID = function (db, userID) {
  return db.query(`SELECT * FROM user_games WHERE user_games.user_id = ${userID}`)
    .then(res => res.rows);
};

module.exports = { getAllGamesFromDB, getOnePublicGameByGameID, getOneGameByGameName, getAllGamesByCategoryID, getAllGamesByUserID };