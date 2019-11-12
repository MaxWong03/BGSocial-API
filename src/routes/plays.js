const router = require("express").Router();

const { getLoggedUserId, arrayToObject } = require('../utils');
const {
  isUserInPlay,
  getPlaysByUserId,
  getPlaysUserByPlayIds,
  addPlay,
  addUserPlay,
  deleteUserPlay,
  updateUserPlay,
  updatePlay,
  deletePlay,
  getPlaysStatistics
} = require('../db/selectors/plays');

const { getUsersByIds, getFriendsIdByUserId } = require('../db/selectors/users');

const { getGamesByIds } = require('../db/selectors/games');

// Avoiding too many requests, we are returning all related data
// /plays
// /games/1
// /games/2
// /plays/1/plays_users
// /plays/4/plays_users

// TODO: Add parameter to make it optional to return the related data

// /games/4/statistics?userId

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
          const gamesById = arrayToObject(games, 'id');

          plays.forEach(play => {
            play.playsUsers = playsUsers.filter(playUser => playUser.play_id == play.id);
          });

          let userIds = playsUsers.map(play => play.user_id);
          userIds = [...new Set(userIds)]; // Make ids unique
          getUsersByIds(db, userIds).then(users => {
            const usersById = arrayToObject(users, 'id');
            res.json({ plays: plays, games: gamesById, users: usersById });
          });

        }).catch(e => console.log(e));

      });
  });

  // get all plays of the user by games id getPlaysStatistics = function (db, gameId, isWinner, users)
  router.get("/:gameId/games-statistics", async (req, res) => {
    let excludedUserId = -1;
    const userId = getLoggedUserId(req);
    const gameId = req.params.gameId
    let isWinner = undefined;
    if (req.query.winner === 'false') {
      isWinner = false;
    }
    if (req.query.winner === 'true') {
      isWinner = true;
    }
    let usersId = undefined;
    if(req.query.users === 'friends'){
      const users = await getFriendsIdByUserId(db, userId)
      usersId = users.map(user => user.id);
    }
    if(req.query.users === 'global'){
      excludedUserId = userId;
    }
    if(req.query.users === undefined || req.query.users === null)  {
      usersId = [userId];
    }
    getPlaysStatistics(db, gameId, isWinner, usersId, excludedUserId)
      .then(plays => {
            res.json(plays);
          }).catch(e => console.log(e));
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
    if (!isUserInPlay(db, Number(req.params.id), userId) || Number(req.params.id) !== Number(req.body.id)) {
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

// updatePlay(db, {...req.body, play_id:req.params.id})
