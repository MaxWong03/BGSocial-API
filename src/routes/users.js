const router = require("express").Router();
const { getLoggedUserId } = require('../utils');
const { getAllUsers } = require('../db/selectors/users');


module.exports = db => {
  router.get("/", (req, res) => {
    getAllUsers(db)
      .then(data => {
        res.json({ users: data })
      })
  });

  return router;
};
