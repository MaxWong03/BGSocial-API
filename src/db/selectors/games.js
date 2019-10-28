const pg = require("pg");

const getAllGamesFromDB = function (db) {
  return db.query(`SELECT * FROM games;`)
    .then(res => res.rows);
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
  return db.query(`select category from games where category ILIKE '%${categorySearchingPattern}%'`)
    .then(res => res.rows);
};

// get a list of games owned by one user based on the User id
const getAllGamesByUserID = function (db, userID) {
  return db.query(`SELECT * FROM user_games WHERE user_id = ${userID}`)
    .then(res => res.rows);
};

// get all the games for one specific event
const getAllGamesByEventID = function (db, eventID) {
  return db.query(`select * from event_games where event_id = ${eventID}`)
    .then(res => res.rows);
};

// find the game a user play in a specific event based on the user id and event id
// conditions: user must join the event (attendances.is_confirmed = TRUE)
// this is commented out since it is too similar with the getAllGamesByEventID
// since we assume all players in the event will play every game in the event
//
// const getAllGamesByUserIDNEventID = function (db, userID, eventID) {
//   return db.query(`SELECT * FROM event_games JOIN attendances ON attendances.event_id = event_games.event_id WHERE event_games.event_id = ${eventID} AND attendances.is_confirmed = TRUE AND attendances.attendant_id = ${userID};`)
//     .then(res => res.rows);
// };

const getGamesByIds = function (db, gameIds) {
  return db.query(`SELECT * FROM games WHERE id = ANY($1::int[])`, [gameIds])
    .then(res => res.rows);
};

module.exports = {
  getGamesByIds,
  getAllGamesFromDB,
  getOnePublicGameByGameID,
  getOnePublicGameByPattern,
  getAllGameIDsByCategorySearchingPattern,
  getAllGamesByUserID,
  getAllGamesByEventID
};