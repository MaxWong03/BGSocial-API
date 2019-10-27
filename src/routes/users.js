const router = require("express").Router();
const { getLoggedUserId } = require('../utils');
const { getAllUsers, getUserById, createUser, getFriendsByUserId } = require('../db/selectors/users');


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
    console.log('afeter');
    getFriendsIdByUserId(db, userId)
      .then(users => {
        // friends = users.filter(friend => playUser.play_id == play.id);
        res.json(users);
      })
  });

  router.get("/:id", (req, res) => {
    getUserById(db, req.params.id)
      .then(user => {
        res.json(user);
      })
  });

  return router;
};
