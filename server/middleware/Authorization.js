const { Post, User } = require('../models');

let Authorization = async (req, res, next) => {
  try {
    let idUser = req.user.id;
    let targetUser = await User.findByPk(idUser);

    if (targetUser.role == 'Admin') {
      next();
    } else {
      throw { name: 'forbidden' };
    }
  } catch (error) {
    next(error);
  }
};

module.exports = Authorization;
