const router = require("express").Router();

const { getLoggedUserId } = require('../utils');
const { getPlaysByUserId } = require('../db/plays.js');

module.exports = db => {
  router.get("/plays", (req, res) => {
    const userId = getLoggedUserId(req);
    getPlaysByUserId(db, userId)
      .then(data => {
        res.json({ plays: data });
      })
  });

  return router;
};