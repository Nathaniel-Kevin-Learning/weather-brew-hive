'use strict';
const { Model, DataTypes } = require('sequelize');

module.exports = (sequelize, DataTypes) => {
  class Type extends Model {
    static associate(models) {
      // Define association here
      Type.hasMany(models.Post, {
        foreignKey: 'typeId',
        onDelete: 'cascade',
        hooks: true,
      });
    }
  }

  Type.init(
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Name is required',
          },
          notEmpty: {
            msg: 'Name cannot be empty',
          },
        },
      },
    },
    {
      sequelize,
      modelName: 'Type',
    }
  );

  return Type;
};
