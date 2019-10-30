const jwt = require('jsonwebtoken');
require('./../environment');

function getLoggedUserId(req) {
  const token = req.headers["x-auth-token"];
  const user = jwt.verify(token, process.env.SECRET_APP_KEY);
  console.log('Logged user', user);
  return user.id;
};

function createAuthorizationToken(userId) {
  const token = jwt.sign({ userId }, process.env.SECRET_APP_KEY); //get the private key from the config file -> environment variable
  return token;
}

module.exports = { getLoggedUserId, createAuthorizationToken }