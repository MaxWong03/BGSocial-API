const router = require("express").Router();
const { getLoggedUserId } = require('../utils'); // get the user ID based on the login user
const { getAllGamesFromDB, getOnePublicGameByGameID, getOnePublicGameByPattern, getAllGameIDsByCategorySearchingPattern, getAllGamesByUserID, getAllGamesByEventID, getAllGamesByUserIDNEventID }= require('../db/selectors/games');

module.exports = db => {
  // get all the PUBLIC games from database
  // this si refered as all game library
  router.get("/library/games", (req, res) => {
    // const userId = getLoggedUserId(req);
    getAllGamesFromDB(db)
      .then(data => {
        res.json({ allLibraryGames: data });
      })
  });

  router.get("/games/:gameID", (req, res) => {
    const gameID = req.params.gameID;
    getOnePublicGameByGameID(db, gameID)
      .then(data => {
        res.json( {game: data} );
      })
  });

  // NOTICE: save for later
  // check how the URL will work
  router.get("/games/:gamePattern", (req, res, next) => {
    
    const gamePattern = req.params.gamePattern;
    console.log("A new request received at " + Date.now());
    console.log(gamePattern);
    next();
  });

  router.get("/games/:gamePattern", (req, res) => {
    const gamePattern = req.params.gamePattern;
    console.log(gamePattern);
    getOnePublicGameByPattern(db, gamePattern)
      .then(data => {
        res.json({ games: data });
      })
  });


  // NOTICE: save for later
  router.get("/games/:categorySearchingPattern", (req, res) => {
    const categorySearchingPattern = req.params.categorySearchingPattern;
    getAllGameIDsByCategorySearchingPattern(db, categorySearchingPattern)
      .then(data => {
        res.json({ games: data });
      })
  });

  // get all the games by user ID
  router.get("/games", (req, res) => {
    const userId = getLoggedUserId(req);
    getAllGamesByUserID(db, userId)
      .then(data => {
        res.json( {gamesByUserID: data} );
      })
  });

  // getAllGamesByEventID
  router.get("/event/:eventID/games", (req, res) => {
    const eventID = req.params.eventID;
    getAllGamesByEventID(db, eventID)
      .then(data => {
        res.json( {eventGames: data} );
      })
  });

  // getAllGamesByUserIDNEventID
  router.get("/event/:eventID/games/testing", (req, res) => {
    const eventID = req.params.eventID;
    const userId = getLoggedUserId(req);
    getAllGamesByEventID(db, userId, eventID)
      .then(data => {
        res.json( {getAllGamesByEventID: data} );
      })
  });

  return router;
};