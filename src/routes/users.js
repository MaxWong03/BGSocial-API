const router = require("express").Router();
const { getLoggedUserId } = require('../utils');
const { getAllUsers, getUserByFBId, createUser, getFriendsIdByUserId } = require('../db/selectors/users');


module.exports = db => {
  router.get("/", (req, res) => {
    getAllUsers(db)
      .then(data => {
        res.json({ users: data })
      })
  });

  router.post("/", (req, res) => {
    createUser(db)
      .then(data => {
        res.status(204).json({});
      })
  });
  
  router.get("/friends", (req, res) => {
    const userId = getLoggedUserId(req);
    getFriendsIdByUserId(db, userId)
      .then(users => {
        // friends = users.filter(friend => playUser.play_id == play.id);
        res.json(users);
      })
  });

  router.get("/facebook/:id", (req, res) => {
    getUserByFBId(db, req.params.id)
      .then(user => {
        res.json(user);
      })
  });

  router.get("/friends", (req, res) => {
    const userId = getLoggedUserId(req);
    getFriendsIdByUserId(db, userId)
      .then(users => {
        res.json(users);
      })
  });

  router.get("/:id/friends", (req, res) => {
    getFriendsIdByUserId(db, req.params.id)
      .then(friends => {
        res.json(friends);
      });
  });

  return router;
};
