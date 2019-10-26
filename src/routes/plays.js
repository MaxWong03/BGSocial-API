const router = require("express").Router();

const { getLoggedUserId } = require('../utils');
const {
  isUserInPlay,
  getPlaysByUserId,
  getPlaysUserByPlayIds,
  addPlay,
  addUserPlay,
  deleteUserPlay,
  updateUserPlay,
  updatePlay,
  deletePlay
} = require('../db/plays.js');
const { getGamesByIds } = require('../db/games.js');

// Avoiding too many requests, we are returning all related data
// /plays
// /games/1
// /games/2
// /plays/1/plays_users
// /plays/4/plays_users

// TODO: Add parameter to make it optional to return the related data

// /games/4/statistics?userId

const errorHandler = (res) => {
  return err => {
    console.log(err);
    res
      .status(500)
      .json({ error: err.message });
  }
};

module.exports = db => {
  router.get("/", (req, res) => {
    const userId = getLoggedUserId(req);
    getPlaysByUserId(db, userId)
      .then(plays => {
        const gameIds = plays.map(play => play.game_id);
        const playsIds = plays.map(play => play.id);

        Promise.all([
          getPlaysUserByPlayIds(db, playsIds),
          getGamesByIds(db, gameIds)
        ]).then(([playsUsers, games]) => {
          const gamesById = games.reduce((accum, item) => {
            accum[item.id] = item;
            return accum;
          }, {});

          plays.forEach(play => {
            play.playsUsers = playsUsers.filter(playUser => playUser.play_id == play.id);
          });

          res.json({ plays: plays, games: gamesById });
        }).catch(e => console.log(e));

      });
  });

  router.post("/", (req, res) => {
    addPlay(db, req.body)
      .then(play => {
        const promises = req.body.playsUsers.map(playsUser => addUserPlay(db, { ...playsUser, play_id: play.id }));
        Promise.all(promises)
          .then(playsUsers => {
            res.json({ ...play, playsUsers });
          });
      })
      .catch(err => {
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/:id/delete", (req, res) => {
    const userId = getLoggedUserId(req);
    deleteUserPlay(db, req.params.id, userId)
      .then(() => {
        res.send("Success");
        getPlaysUserByPlayIds(db, [req.params.id])
          .then((playsUsers) => {
            if (playsUsers.length === 0) {
              deletePlay(db, req.params.id)
            };
          });
      })
      .catch(err => {
        console.log("About to error out", err);
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  router.post("/:id/edit", (req, res) => {
    const userId = getLoggedUserId(req);

    console.log('req.params.id', typeof req.params.id);
    console.log('req.body.id', typeof req.body.id);
    console.log('userId', userId);
    if (!isUserInPlay(db, req.params.id, userId) || req.params.id !== `${req.body.id}`) {
      res
        .status(403)
        .json({ error: "Forbidden" });
      return;
    }

    updatePlay(db, req.body)
      .then(play => {
        const promises = req.body.playsUsers.map(playByUser => updateUserPlay(db, playByUser));
        Promise.all(promises)
          .then(playsUsers => {
            res.json({ ...play, playsUsers });
          });
      }).catch(err => {
        console.log(err);
        res
          .status(500)
          .json({ error: err.message });
      });
  });

  return router;
};
