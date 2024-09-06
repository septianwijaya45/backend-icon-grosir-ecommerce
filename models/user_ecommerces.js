"use strict";
const { Model } = require("sequelize");
const bcrypt = require("bcrypt");
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
      no_telepon: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      is_verify: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "User_Ecommerces",
      paranoid: true,
      hooks: {
        beforeSave: async (user) => {
          if (user.changed("password")) {
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(user.password, salt);
          }
        },
      },
    }
  );
  return User_Ecommerces;
};
