"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class T_Carts extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      T_Carts.belongsTo(models.User_Ecommerces, {
        foreignKey: "user_ecommerce_id",
        as: "User_Ecommerces",
      });
      T_Carts.hasMany(models.T_Wishlist_Details, {
        foreignKey: "cart_id",
        as: "T_Wishlist_Details",
      });
    }
  }
  T_Carts.init(
    {
      user_ecommerce_id: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "T_Carts",
    }
  );
  return T_Carts;
};
