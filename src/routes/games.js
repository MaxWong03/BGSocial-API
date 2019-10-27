const router = require("express").Router();
const { getLoggedUserId } = require('../utils'); // get the user ID based on the login user
const { getAllGamesFromDB, getOnePublicGameByGameID, getOnePublicGameByPattern, getAllGameIDsByCategorySearchingPattern, getAllGamesByUserID, getOneGameByUserID, getAllGamesByEventID, getAllGamesForPlayerInEvent, addUserGame, removeUserGame } = require('../db/selectors/games');

const user_gamesColumnsNames = [
  'game_id',
  'user_id'
];

module.exports = db => {
  // get all the PUBLIC games from database
  // this is refered as all game library
  router.get("games/library", (req, res) => {
    getAllGamesFromDB(db)
      .then(data => {
        res.json({ allLibraryGames: data });
      })
  });

  router.post("/user/newGame/:userID/:gameID", (req, res) => {
    const userID = req.params.userID;
    const gameID = req.params.gameID;
    addUserGame(db, gameID, userID)
      .then(data => {
        res.json( { message: "successfully added a new game"} );
      })
    });

  // get one game from public library
  router.get("/games/library/:gameID", (req, res) => {
    const gameID = req.params.gameID;
    getOnePublicGameByGameID(db, gameID)
      .then(data => {
        res.json( { selectedGame: data } );
      })
  });

  // remove one game from user's game list
  router.get("/user/:userID/removeGame/:gameID", (req, res) => {
    const gameID = req.params.gameID;
    const userID = req.params.userID;
    removeUserGame(db, gameID, userID)
        .then(data => {
          res.json( { selectedGame: data } );
        })
  });

  // find games matching the entered pattern in game library
  router.get("/games/library/searchNames/:gamePattern", (req, res) => {
    const gamePattern = req.params.gamePattern;
    console.log(gamePattern);
    getOnePublicGameByPattern(db, gamePattern)
      .then(data => {
        res.json({ gamesMatchingNamePattern: data });
      })
  });

  // find games matching the entered Category pattern in game library
  router.get("/games/library/searchCategories/:categorySearchingPattern", (req, res) => {
    const categorySearchingPattern = req.params.categorySearchingPattern;
    getAllGameIDsByCategorySearchingPattern(db, categorySearchingPattern)
      .then(data => {
        res.json({ gamesMatchingCategoryPattern: data });
      })
  });

  // get all the games owned by a user by given user ID
  router.get("/user/games/:userID", (req, res) => {
    const userId = req.params.userID;
    getAllGamesByUserID(db, userId)
      .then(data => {
        res.json( {gamesByUserID: data} );
      })
  });

  // get all the games owned by a user by given user ID
  router.get("/user/games/:userID/:gameID", (req, res) => {
    const userID = req.params.userID;
    const gameID = req.params.gameID;
    getOneGameByUserID(db, userID, gameID)
      .then(data => {
        res.json( {aGameByUserIDGameID: data} );
      })
  });
  
  router.get("/event/:eventID/games", (req, res) => {
    const eventID = req.params.eventID;
    getAllGamesByEventID(db, eventID)
      .then(data => {
        res.json( {eventGames: data} );
      })
  });

  router.get("/event/:eventID/games/:userID/", (req, res) => {
    const eventID = req.params.eventID;
    const userID = req.params.userID;
    getAllGamesForPlayerInEvent(db, userId, eventID)
      .then(data => {
        res.json( {getAllGamesByEventID: data} );
      })
  });
  return router;
};