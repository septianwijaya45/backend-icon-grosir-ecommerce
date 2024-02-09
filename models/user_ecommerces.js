"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class User_Ecommerces extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      Users.hasOne(modes.M_Customers, {
        foreignKey: "user_ecommerce_id",
        as: "M_Customers",
      });
      Users.hasMany(modes.T_Wishlists, {
        foreignKey: "user_ecommerce_id",
        as: "T_Wishlists",
      });
      Users.hasMany(modes.T_Carts, {
        foreignKey: "user_ecommerce_id",
        as: "T_Carts",
      });
      Users.hasMany(modes.T_Transaksies, {
        foreignKey: "user_ecommerce_id",
        as: "T_Transaksies",
      });
    }
  }
  User_Ecommerces.init(
    {
      uuid: DataTypes.UUID,
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      is_verify: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User_Ecommerces",
    }
  );
  return User_Ecommerces;
};
