const router = require("express").Router();
const { getLoggedUserId } = require('../utils');
const { getAllUsers, getUserByFBId, createUser, getFriendsIdByUserId, getUserId, addFriendRequest, getFriendRequestForSender, getFriendRequestForReceiver, cancelFriendRequest, confirmFriendRequest } = require('../db/selectors/users');


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
  router.post("/request/:friendRequestId", (req, res) => {
    const userIdOne = getLoggedUserId(req);
    const userIdTwo = req.params.friendRequestId;
    addFriendRequest(db, userIdOne, userIdTwo)
      .then(friends => {
        // return the user object to make the "Set state part easier"
        getUserId(db, userIdTwo)
        .then(user => {
          res.json( {user: user} )
        })
      });
  });

  // Get all the pending request send by this user
  // ok
  router.get("/request/sent", (req, res) => {
    const userID = getLoggedUserId(req);
    getFriendRequestForSender(db, userID)
      .then(data => {
        res.json({ users: data });
    });
  });

  // Get all the pending request received by this user
  // ok
  router.get("/request/received", (req, res) => {
    const userID = getLoggedUserId(req);
    getFriendRequestForReceiver(db, userID)
      .then(data => {
        res.json({ users: data });
    });
  });

  // Cancel a friend request
  router.post("/request/:user/delete", (req, res) => {
    const userIdOne = getLoggedUserId(req);
    const userIdTwo = req.params.user;
    cancelFriendRequest(db, userIdOne, userIdTwo)
      .then(
        getUserId(db, userIdTwo)
        .then(user => {
          res.json( {user: user} )
        })
      );
  });

  // Accept a friend request
  // unable to make a put
  router.post("/request/:friend/confirm", (req, res) => {
    const userIdOne = getLoggedUserId(req);
    const userIdTwo = req.params.friend;
    cancelFriendRequest(db, userIdTwo, userIdOne )
      .then(() => {
        confirmFriendRequest(db, userIdOne, userIdTwo)
        .then(
          getUserId(db, userIdTwo)
          .then(user => {
            res.json( {user: user} )
          })
        )
      });
  });

  return router;
};