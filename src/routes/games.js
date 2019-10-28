const router = require("express").Router();
const { getLoggedUserId } = require('../utils'); // get the user ID based on the login user
const { getAllGamesFromDB, addUserGame, removeUserGame, getOnePublicGameByGameID, getAllGamesByUserID, getOnePublicGameByPattern, getAllGameIDsByCategorySearchingPattern, getOneGameByUserID, getAllGamesByEventID, getAllGamesForPlayerInEvent } = require('../db/selectors/games');

module.exports = db => {
  // get all the PUBLIC games from database
  // this is refered as all game library
  router.get("games/library", (req, res) => {
    getAllGamesFromDB(db)
      .then(data => {
        res.json({ allLibraryGames: data });
      })
  });

  router.post("/user/:userID/game/:gameID", (req, res) => {
    const userID = req.params.userID;
    const gameID = req.params.gameID;
    addUserGame(db, gameID, userID)
      .then(data => {
        res.json( { message: "successfully added a new game"} );
    })
  });

  // remove one game from user's game list
  router.post("/user/:userID/game/:gameID/delete", (req, res) => {
    const gameID = req.params.gameID;
    const userID = req.params.userID;
    removeUserGame(db, gameID, userID)
        .then(data => {
          res.json( { selectedGame: data } );
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

    // get all the games owned by a user by given user ID
    router.get("/user/games/:userID", (req, res) => {
      const userId = req.params.userID;
      getAllGamesByUserID(db, userId)
        .then(data => {
          res.json( {gamesByUserID: data} );
        })
    });

  // find games matching the entered pattern in game library
  router.get("/games/library/name?game-pattern=:gamePattern", (req, res) => {
    console.log(req);
    const gamePattern = req.params.game-pattern;
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