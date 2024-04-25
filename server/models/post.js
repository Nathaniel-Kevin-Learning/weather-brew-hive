'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Post.belongsTo(models.User, { foreignKey: 'userId' });
      Post.belongsTo(models.Type, { foreignKey: 'typeId' });
    }
  }
  Post.init(
    {
      title: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Title is required',
          },
          notEmpty: {
            msg: 'Title is required',
          },
        },
      },
      shortDescription: {
        type: DataTypes.STRING,
        allowNull: false, // Make shortDescription required
        validate: {
          notNull: {
            msg: 'Short description is required',
          },
          notEmpty: {
            msg: 'Short description is required',
          },
          maximalWord(value) {
            if (value.split(' ').length > 30) {
              throw new Error(
                'maximal character is 30 words for short description'
              );
            }
          },
        },
      },
      longDescription: {
        type: DataTypes.TEXT,
        allowNull: false, // Make longDescription required
        validate: {
          notNull: {
            msg: 'Long description is required',
          },
          notEmpty: {
            msg: 'Long description is required',
          },
          minimalWord(value) {
            if (value.split(' ').length < 10) {
              throw new Error(
                'minimal character in long description is 10 words'
              );
            }
          },
        },
      },
      imgUrl: {
        type: DataTypes.STRING,
        allowNull: false, // Make imgUrl required
        validate: {
          notNull: {
            msg: 'Image URL is required',
          },
          notEmpty: {
            msg: 'Image URL is required',
          },
        },
      },
      typeId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Post type is required',
          },
          notEmpty: {
            msg: 'Post type is required',
          },
        },
      },
      userId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: 'Post',
    }
  );
  return Post;
};
