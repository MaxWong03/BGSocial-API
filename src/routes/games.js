const router = require("express").Router();
const { getLoggedUserId } = require('../utils'); // get the user ID based on the login user
const { getAllGamesFromDB, addUserGame, removeUserGame, getOnePublicGameByGameID, getAllGamesByUserID,  getAllGameIDsByCategorySearchingPattern, getOneGameByUserID, getAllGamesByEventID, getAllGamesForPlayerInEvent, getOnePublicGameByPattern } = require('../db/selectors/games');

module.exports = db => {

  // find games matching the entered pattern in game library

  // router.get("/games/library/?name=", (req, res) => {
  //   let namePattern = req.query.name;
  //   // const gamePattern = req.params.gamePattern;
  //   getOnePublicGameByPattern(db, namePattern)
  //   .then(data => {
  //     res.json({
  //       matchingGames: data
  //     });
  //   })
  // });

  // get all the PUBLIC games from database
  // this is refered as all game library
  router.get("/games/library", (req, res) => {
    let namePattern = req.query.name;
    let catePattern = req.query.category;
    if (namePattern !== undefined) {
      getOnePublicGameByPattern(db, namePattern)
      .then(data => {
        res.json({
          matchingGames: data
        });
      })
    }
    else if (catePattern !== undefined) {
      getAllGameIDsByCategorySearchingPattern(db, catePattern)
      .then(data => {
        res.json({ games: data });
      })
    }
    else {
      // const string = "" + typeof(namePattern);
      getAllGamesFromDB(db)
      .then(data => {
        res.json({
          games: data,
          // pattern: "" + string 
        });
      })
    }
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
        res.json( { game: data } );
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
  // router.get("/games/library/?name=:pattern", (req, res) => {
  //   console.log(req);
  //   const pattern = req.params.pattern;
  //   // const gamePattern = req.params.gamePattern;
  //   getOnePublicGameByPattern(db, pattern)
  //     .then(data => {
  //       res.json({
  //         games: data,
  //       });
  //     })
  // });

  // find games matching the entered Category pattern in game library

  // router.get("/games/library/searchCategories/:categorySearchingPattern", (req, res) => {
  //   const categorySearchingPattern = req.params.categorySearchingPattern;
  //   getAllGameIDsByCategorySearchingPattern(db, categorySearchingPattern)
  //     .then(data => {
  //       res.json({ games: data });
  //     })
  // });

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
        res.json( {games: data} );
      })
  });

  // get all the games a player plays in one event
  // ok
  router.get("/event/:eventID/games/:userID/", (req, res) => {
    const eventID = req.params.eventID;
    const userID = req.params.userID;
    getAllGamesForPlayerInEvent(db, userID, eventID)
      .then(data => {
        res.json( {games: data} );
      })
  });
  return router;
};