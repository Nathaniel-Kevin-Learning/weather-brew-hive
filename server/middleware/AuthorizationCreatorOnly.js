const { Post, User } = require('../models');

let AuthorizationCreatorOnly = async (req, res, next) => {
  try {
    let idUser = req.user.id;

    let postId = req.params.id;
    postData = await Post.findByPk(postId);

    if (postData == null || !postData) {
      throw { name: 'missingData' };
    }
    if (postData.userId != idUser) {
      let dataUser1 = await User.findByPk(postData.userId);
      let dataUser2 = await User.findByPk(idUser);

      if (dataUser1.email == dataUser2.email) {
        next();
        return;
      } else {
        throw { name: 'forbidden' };
      }
    }
    next();
  } catch (error) {
    next(error);
  }
};

module.exports = AuthorizationCreatorOnly;
