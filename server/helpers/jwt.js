var jwt = require('jsonwebtoken');

function createJWT(payload) {
  var token = jwt.sign(payload, process.env.JWT_SECRETE);
  return token;
}

function decryptJWT(token) {
  var payload = jwt.verify(token, process.env.JWT_SECRETE);
  return payload;
}

module.exports = { createJWT, decryptJWT };
