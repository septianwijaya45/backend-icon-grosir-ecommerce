"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class T_Wishlist_Details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      T_Wishlist_Details.belongsTo(models.T_Wishlists, {
        foreignKey: "wishlist_id",
        as: "T_Wishlists",
      });
    }
  }
  T_Wishlist_Details.init(
    {
      wishlist_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      price: DataTypes.FLOAT,
      qty: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "T_Wishlist_Details",
      paranoid: true,
    }
  );
  return T_Wishlist_Details;
};
