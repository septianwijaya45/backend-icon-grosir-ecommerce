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
      User_Ecommerces.hasOne(models.M_Customers, {
        foreignKey: "user_ecommerce_id",
        as: "M_Customers",
      });
      User_Ecommerces.hasMany(models.T_Wishlists, {
        foreignKey: "user_ecommerce_id",
        as: "T_Wishlists",
      });
      User_Ecommerces.hasMany(models.T_Carts, {
        foreignKey: "user_ecommerce_id",
        as: "T_Carts",
      });
      User_Ecommerces.hasMany(models.T_Transaksies, {
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
