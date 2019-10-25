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

  // get one game from public library
  router.get("/games/:gameID", (req, res) => {
    const gameID = req.params.gameID;
    getOnePublicGameByGameID(db, gameID)
      .then(data => {
        res.json( {game: data} );
      })
  });

  // find games matching the entered pattern in game library
  router.get("/games/searchNames/:gamePattern", (req, res) => {
    const gamePattern = req.params.gamePattern;
    console.log(gamePattern);
    getOnePublicGameByPattern(db, gamePattern)
      .then(data => {
        res.json({ gamesMatchingPattern: data });
      })
  });

  // find games matching the entered Category pattern in game library
  router.get("/games/searchCategories/:categorySearchingPattern", (req, res) => {
    const categorySearchingPattern = req.params.categorySearchingPattern;
    getAllGameIDsByCategorySearchingPattern(db, categorySearchingPattern)
      .then(data => {
        res.json({ games: data });
      })
  });

  // get all the games owned by a user by given user ID
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
  // router.get("/event/:eventID/games/testing", (req, res) => {
  //   const eventID = req.params.eventID;
  //   const userId = getLoggedUserId(req);
  //   getAllGamesByEventID(db, userId, eventID)
  //     .then(data => {
  //       res.json( {getAllGamesByEventID: data} );
  //     })
  // });

  return router;
};