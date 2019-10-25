const router = require("express").Router();
const { getLoggedUserId } = require('../utils');
const { getAllUsers, getUserById, createUser } = require('../db/selectors/users');


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

  return router;
};
