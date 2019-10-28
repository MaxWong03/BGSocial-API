const router = require("express").Router();
const { getLoggedUserId } = require('../utils'); // get the user ID based on the login user
const { getAllGamesFromDB, addUserGame, removeUserGame, getOnePublicGameByGameID, getAllGamesByUserID, getOnePublicGameByPattern, getAllGameIDsByCategorySearchingPattern, getOneGameByUserID, getAllGamesByEventID, getAllGamesForPlayerInEvent } = require('../db/selectors/games');

module.exports = db => {
  // get all the PUBLIC games from database
  // this is refered as all game library
  router.get("games/library", (req, res) => {
    getAllGamesFromDB(db)
      .then(data => {
        res.json({ games: data });
      })
  });

  // ok
  router.post("/user/:userID/game/:gameID", (req, res) => {
    const userID = req.params.userID;
    const gameID = req.params.gameID;
    addUserGame(db, gameID, userID)
      .then(data => {
        res.json( { message: `successfully added a new game for user with ID ${userID}`} );
    })
  });

  // remove one game from user's game list
  // ok
  router.post("/user/:userID/game/:gameID/delete", (req, res) => {
    const gameID = req.params.gameID;
    const userID = req.params.userID;
    removeUserGame(db, gameID, userID)
        .then(data => {
          res.json( { game: "sucessfully delele a game" } );
        })
  });

  // get one game from public library
  // ok
  router.get("/games/library/:gameID", (req, res) => {
    const gameID = req.params.gameID;
    getOnePublicGameByGameID(db, gameID)
      .then(data => {
        res.json( { selectedGame: data } );
      })
  });

    // get all the games owned by a user by given user ID
    // ok
    router.get("/user/games/:userID", (req, res) => {
      const userID = req.params.userID;
      getAllGamesByUserID(db, userID)
        .then(data => {
          res.json( {games: data} );
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

  // get one game owned by a user by given user ID
  // ok
  router.get("/user/games/:userID/:gameID", (req, res) => {
    const userID = req.params.userID;
    const gameID = req.params.gameID;
    getOneGameByUserID(db, userID, gameID)
      .then(data => {
        res.json( {game: data} );
      })
  });

  // ok
  router.get("/event/:eventID/games", (req, res) => {
    const eventID = req.params.eventID;
    getAllGamesByEventID(db, eventID)
      .then(data => {
        res.json( {eventGames: data} );
      })
  });

  // get all the games a player plays in one event
  // ok
  router.get("/event/:eventID/games/:userID/", (req, res) => {
    const eventID = req.params.eventID;
    const userID = req.params.userID;
    getAllGamesForPlayerInEvent(db, userID, eventID)
      .then(data => {
        res.json( {Games: data} );
      })
  });
  return router;
};