const pg = require("pg");

const getAllGamesFromDB = function (db) {
  return db.query(`SELECT * FROM games;`)
    .then(res => res.rows);
};

const addUserGame = function (db, gameID, userID ) {
  return db.query(`INSERT INTO user_games (game_id, user_id) VALUES ($1, $2);`, [gameID, userID])
    .then(res => res);
};

const removeUserGame = function ( db, gameID, userID ){
  return db.query(`DELETE FROM user_games WHERE user_id = $1 AND game_id = $2;`, [userID, gameID])
    .then(res => res);
};

const getOnePublicGameByGameID = function (db, gameID) {
  return db.query(`SELECT * FROM games WHERE games.id = $1`, [gameID])
    .then(res => res.rows);
};

// get a list of games owned by one user based on the User id
const getAllGamesByUserID = function (db, userID) {
  return db.query(`SELECT games.*, ( SELECT plays.date ::timestamp FROM plays JOIN plays_users ON plays.id = plays_users.play_id WHERE plays_users.user_id = $1 AND plays.game_id = games.id ORDER BY date DESC LIMIT 1)  as last_play FROM games JOIN user_games on games.id = user_games.game_id WHERE user_games.user_id = $1`, [userID])
    .then(res => res.rows);
};

// this happens when a user enter a string pattern in search bar
// the string can be uncompleted, so here we use ILIKE, which makes the game searching case insensitive
const getOnePublicGameByPattern = function (db, searchPattern) {
  return db.query(`SELECT * FROM games WHERE games.name ILIKE $1||'%'`, [searchPattern])
    .then(res => res.rows);
};

// get a list of games by searching the categories name using ILIKE
// just save it for now, since the app wont be able to search the games by uncompleted/ case insensitived categories names
const getAllGameIDsByCategorySearchingPattern = function (db, categorySearchingPattern) {
  return db.query(`select * from games where category ILIKE '%'||$1||'%'`, [categorySearchingPattern])
    .then(
      res => res.rows
    );
}

// get a game owned by one user based on the User id and game ID
const getOneGameByUserID = function (db, userID, gameID) {
  return db.query(`SELECT games.*, ( SELECT plays.date ::timestamp FROM plays JOIN plays_users ON plays.id = plays_users.play_id WHERE plays_users.user_id = $1 AND plays.game_id = games.id ORDER BY date DESC LIMIT 1) as last_play FROM games JOIN user_games on games.id = user_games.game_id WHERE user_games.user_id = $1 AND user_games.game_id = $2`, [userID, gameID])
    .then(res => res.rows[0]);
};

// get all the games for one specific even
const getAllGamesByEventID = function (db, eventID) {
  return db.query(`select games.* from event_games JOIN games ON games.id = event_games.game_id where event_id = $1`, [eventID])
    .then(res => res.rows);
};

// find the game a user play in a specific event based on the user id and event id
// conditions: user must join the event (attendances.is_confirmed = TRUE)
// since we assume all players in the event will play every game in the event
const getAllGamesForPlayerInEvent = function (db, userID, eventID) {
  return db.query(`SELECT * FROM event_games JOIN attendances ON attendances.event_id = event_games.event_id WHERE event_games.event_id = $1 AND attendances.is_confirmed = TRUE AND attendances.attendant_id = $2;`, [eventID, userID])
    .then(res => res.rows);
};

// count the win percentate for a user and one game
const winPercentageOfAGameForAPlayer = function(db, userID, gameID){
  return db.query(`SELECT ROUND(
    100.0 * (
      select count(plays_users.is_winner) from plays_users 
      JOIN plays ON plays.id = plays_users.play_id 
      WHERE user_id = $1 AND plays.game_id = $2 AND plays_users.is_winner = TRUE
    ) / 
    ( select count(plays_users.is_winner))  
  ) as percent_total
  From plays_users 
  JOIN plays ON plays.id = plays_users.play_id 
  WHERE user_id = $1 AND plays.game_id = $2;`, 
  [userID, gameID])
  .then(res => res.rows);
};

const getGamesByIds = function (db, gameIds) {
  return db.query(`SELECT * FROM games WHERE id = ANY($1::int[])`, [gameIds])
    .then(res => res.rows);
};

const getLastPlayForGame = function (db, userID, gameID) {
  return db.query(`SELECT plays.date ::timestamp FROM plays JOIN plays_users ON plays.id = plays_users.play_id WHERE plays_users.user_id = $1 AND plays.game_id = $2 ORDER BY date DESC LIMIT 1;`, [userID, gameID])
    .then(res => res.rows);
};

module.exports = { getAllGamesFromDB,
  addUserGame,
  removeUserGame,
  getOnePublicGameByGameID,
  getAllGamesByUserID,
  getAllGameIDsByCategorySearchingPattern,
  getOneGameByUserID,
  getAllGamesByEventID,
  getAllGamesForPlayerInEvent,
  getOnePublicGameByPattern,
  winPercentageOfAGameForAPlayer,
  getGamesByIds,
  getLastPlayForGame
}