'use strict';
const { Model } = require('sequelize');
let { hashData } = require('../helpers/hash');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      User.hasMany(models.Post, { foreignKey: 'userId' });
    }
  }
  User.init(
    {
      email: {
        type: DataTypes.STRING,
        validate: {
          isEmail: {
            msg: 'email format is wrong',
          },
        },
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'password cannot be empty',
          },
          notEmpty: {
            msg: 'password cannot be empty',
          },
        },
      },
      oauth: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
      },
      role: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: 'User',
      hooks: {
        beforeCreate(user) {
          let passwordData = user.password;
          let hashedPass = hashData(passwordData);
          user.password = hashedPass;
          if (user.role == null || !user.role) {
            user.role = 'Users';
          }
        },
        beforeValidate(user) {
          if (user.oauth == true) {
            // perlu di test nanti dengan oauth
            const charset =
              'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()-_=+';
            let password = '';
            for (let i = 0; i < charset.length; i++) {
              const randomIndex = Math.floor(Math.random() * charset.length);
              password += charset[randomIndex];
            }
            let hashedPass = hashData(password);
            user.password = hashedPass;
          }
        },
      },
    }
  );
  return User;
};
