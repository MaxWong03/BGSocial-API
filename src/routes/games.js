const router = require("express").Router();
const { getLoggedUserId } = require('../utils'); // get the user ID based on the login user
const { getAllGamesFromDB,
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
  getLastPlayForGame } = require('../db/selectors/games');

module.exports = db => {

  // this is refered as all game library
  // ok
  router.get("/library", (req, res) => {   // find games matching the entered pattern in game library
    let namePattern = req.query.name;
    let catePattern = req.query.category;
    if (namePattern !== undefined) {
      getOnePublicGameByPattern(db, namePattern)
      .then(data => {
        res.json({ games: data });
      })
    }
    else if (catePattern !== undefined) { // find games matching the entered Category pattern in game library
      getAllGameIDsByCategorySearchingPattern(db, catePattern)
      .then(data => {
        res.json({ games: data });
      })
    }
    else {
      getAllGamesFromDB(db)
      .then(data => {
        res.json({ games: data });
      })
    }
  });

  // add a game for a specific user
  // ok
  router.post("/user/:gameID", (req, res) => {
    const userID = getLoggedUserId(req);
    const gameID = req.params.gameID;
    addUserGame(db, gameID, userID)
      .then(data => {
        res.json( { message: `successfully added a new game ${gameID} for user with ID ${userID}`} );
    })
  });

  // remove one game from user's game list
  // ok
  router.post("/user/:gameID/delete", (req, res) => {
    const gameID = req.params.gameID;
    const userID = getLoggedUserId(req);
    removeUserGame(db, gameID, userID)
        .then(data => {
          res.json( { game: `sucessfully delele a game ${gameID} for user with ID ${userID}` } );
        })
  });

  // get one game from public library
  // ok
  router.get("/library/:gameID", (req, res) => {
    const gameID = req.params.gameID;
    getOnePublicGameByGameID(db, gameID)
      .then(data => {
        res.json( { game: data } );
      })
  });

  // get all the games owned by a user by given user ID
  // ok
  router.get("/user", (req, res) => {
    const userID = getLoggedUserId(req);
    getAllGamesByUserID(db, userID)
      .then(data => {
        res.json( {games: data} );
      })
  });

  // get one game owned by a user by given user ID
  // ok
  router.get("/user/:gameID", (req, res) => {
    const userID = getLoggedUserId(req);
    const gameID = req.params.gameID;
    getOneGameByUserID(db, userID, gameID)
      .then(data => {
        res.json( {game: data} );
      })
  });

  // get win percentage for one game owned by a user by given user ID
  // ok
  router.get("/user/games/:gameID/win", (req, res) => {
    const userID = getLoggedUserId(req);
    const gameID = req.params.gameID;
    winPercentageOfAGameForAPlayer(db, userID, gameID)
      .then(data => {
        res.json( {winPercentage: data} );
      })
  });

  // get the time a game played by a user by given user ID and game ID
  // 
  router.get("/user/games/:gameID/last-played", (req, res) => {
    const userID = getLoggedUserId(req);
    const gameID = req.params.gameID;
    getLastPlayForGame(db, userID, gameID)
      .then(data => {
        // let date = data[0]["date"].slice(10);
        res.json( { lastPlay: data } );
      })
  });











  // Notice
  // ok
  router.get("/event/:eventID/games", (req, res) => {
    const eventID = req.params.eventID;
    getAllGamesByEventID(db, eventID)
      .then(data => {
        res.json( {games: data} );
      })
  });

  // get all the games a player plays in one event
  // ok
  router.get("/event/:eventID/games/", (req, res) => {
    const eventID = req.params.eventID;
    const userID = getLoggedUserId(req);
    getAllGamesForPlayerInEvent(db, userID, eventID)
      .then(data => {
        res.json( {games: data} );
      })
  });



  return router;
};