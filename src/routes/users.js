const router = require("express").Router();
const { getLoggedUserId } = require('../utils');
const { getAllUsers, getUserByFBId, createUser, getFriendsIdByUserId, addFriendRequest } = require('../db/selectors/users');


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
    getFriendsIdByUserId(db, Number(req.params.id))
      .then(friends => {
        res.json(friends);
      });
  });

  // sending the 'add friend' request to another user
  // user ID 1 will be the sender
  // user ID 2: receiver who can decide to accept the request or not
  router.post("/add-friend/:user", (req, res) => {
    const userIdOne = getLoggedUserId(req);
    const userIdTwo = req.params.user;
    addFriendRequest(db, userIdOne, userIdTwo)
      .then(friends => {
        res.json( { "friends": "asdfsafs" } );
      });
  });

  return router;
};
