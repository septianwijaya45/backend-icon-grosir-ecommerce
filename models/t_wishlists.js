"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class T_Wishlists extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      T_Wishlists.belongsTo(models.User_Ecommerces, {
        foreignKey: "user_ecommerce_id",
        as: "User_Ecommerces",
      });
      T_Wishlists.hasMany(models.T_Wishlist_Details, {
        foreignKey: "wishlist_id",
        as: "T_Wishlist_Details",
      });
    }
  }
  T_Wishlists.init(
    {
      user_ecommerce_id: DataTypes.INTEGER,
      status: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "T_Wishlists",
      paranoid: true,
    }
  );
  return T_Wishlists;
};
