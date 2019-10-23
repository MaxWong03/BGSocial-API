const router = require("express").Router();

const { getLoggedUserId } = require('../utils'); // get the user ID based on the login user
const { getAllGamesFromDB, getOnePublicGameByGameID, getOneGameByGameName, getAllGamesByCategoryID, getAllGamesByUserID } = require('../db/games.js');

module.exports = db => {
  // get all the PUBLIC games from database
  router.get("/games", (req, res) => {
    const userId = getLoggedUserId(req);
    getAllGamesFromDB(db)
      .then(data => {
        res.json({ plays: data });
      })
  });

  // router.get("/games/:gameID", (req, res) => {
  //   const userId = getLoggedUserId(req);
  //   getOnePublicGameByGameID(db, gameID)
  //     .then(data => {
  //       res.json({ plays: data });
  //     })
  // });

  // get all the games OWNED by the login user
  // NOTICE: this one should be reviewed by peers!!!
  // this should be "/games/:userID"
  // or ":userID/games"
  router.get("/games/:userID", (req, res) => {
    const userId = getLoggedUserId(req);
    getAllGamesByUserID(db, userID)
      .then(data => {
        res.json({ plays: data });
      })
  });



  return router;
};
