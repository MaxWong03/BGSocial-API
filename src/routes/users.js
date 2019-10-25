const router = require("express").Router();
const { getLoggedUserId } = require('../utils');


module.exports = db => {
  router.get("/users", (req, res) => {
    const userId = getLoggedUserId(req);
    
  });

  return router;
};
