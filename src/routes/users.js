const router = require("express").Router();
const { getLoggedUserId } = require('../utils');
const { getAllUsers, getUserByFBId, createUser } = require('../db/selectors/users');
const { getFriendsByUserID } = require('../db/selectors/friends');


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

  router.get("/facebook/:id", (req, res) => {
    getUserByFBId(db, req.params.id)
      .then(user => {
        res.json(user);
      })
  });

  router.get("/:id/friends", (req, res) => {
    getFriendsByUserID(db, req.params.id)
      .then(friends => {
        res.json(friends);
      });
  });

  return router;
};
