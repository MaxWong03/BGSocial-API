const pg = require("pg");

const getAllGamesFromDB = function (db) {
  return db.query(`SELECT * FROM games;`)
    .then(res => res.rows);
};

const addUserGamesgetOnePublicGameByGameID = function (db, gameID) {
  // return db.query(`SELECT * FROM games WHERE games.id = $1`, [gameID])
  //   .then(res => res.rows);
};

const getOnePublicGameByGameID = function (db, gameID) {
  return db.query(`SELECT * FROM games WHERE games.id = $1`, [gameID])
    .then(res => res.rows);
};

// this happens when a user enter a string pattern in search bar
// the string can be uncompleted, so here we use ILIKE, which makes the game searching case insensitive
const getOnePublicGameByPattern = function (db, searchPattern) {
  return db.query(`SELECT * FROM games WHERE games.name ILIKE '${searchPattern}%'`)
    .then(res => res.rows);
};

// get a list of games by searching the categories name using ILIKE
// just save it for now, since the app wont be able to search the games by uncompleted/ case insensitived categories names
const getAllGameIDsByCategorySearchingPattern = function (db, categorySearchingPattern) {
  return db.query(`select * from games where category ILIKE '%${categorySearchingPattern}%'`)
    .then(res => res.rows);
};

// get a list of games owned by one user based on the User id
const getAllGamesByUserID = function (db, userID) {
  return db.query(`SELECT games.* FROM games JOIN user_games on games.id = user_games.game_id WHERE user_games.user_id = ${userID}`)
    .then(res => res.rows);
};

// get a game owned by one user based on the User id and game ID
const getOneGameByUserID = function (db, userID, gameID) {
  return db.query(`SELECT games.* FROM games JOIN user_games on games.id = user_games.game_id WHERE user_games.user_id = ${userID} AND user_games.game_id = ${gameID}`)
    .then(res => res.rows);
};

// get all the games for one specific even
const getAllGamesByEventID = function (db, eventID) {
  return db.query(`  select games.* from event_games JOIN games ON games.id = event_games.game_id where event_id = ${eventID}`)
    .then(res => res.rows);

};

// find the game a user play in a specific event based on the user id and event id
// conditions: user must join the event (attendances.is_confirmed = TRUE)
// since we assume all players in the event will play every game in the event
//
const getAllGamesForPlayerInEvent = function (db, userID, eventID) {
  return db.query(`SELECT * FROM event_games JOIN attendances ON attendances.event_id = event_games.event_id WHERE event_games.event_id = ${eventID} AND attendances.is_confirmed = TRUE AND attendances.attendant_id = ${userID};`)
    .then(res => res.rows);
};

const addUserGame = function (db, gameID, userID ) {
  return db.query(`INSERT INTO user_games (game_id, user_id) VALUES (${gameID}, ${userID});`)
    .then(res => res);
};

module.exports = { getAllGamesFromDB, getOnePublicGameByGameID, getOnePublicGameByPattern, getAllGameIDsByCategorySearchingPattern, getAllGamesByUserID, getOneGameByUserID, getAllGamesForPlayerInEvent, addUserGame };