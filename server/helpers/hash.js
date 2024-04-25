let bcrypt = require('bcryptjs');
function hashData(input) {
  var salt = bcrypt.genSaltSync(10);
  var hash = bcrypt.hashSync(input, salt);
  return hash;
}

function comparePassword(input, password) {
  let result = bcrypt.compareSync(input, password);
  return result;
}

module.exports = { hashData, comparePassword };
