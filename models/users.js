"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.belongsTo(models.Roles, {
        foreignKey: "role_id",
        as: "Roles",
      });
      Users.hasOne(modes.M_Admins, {
        foreignKey: "user_id",
        as: "M_Admins",
      });
    }
  }
  Users.init(
    {
      uuid: DataTypes.UUID,
      role_id: DataTypes.INTEGER,
      username: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      picture: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};
