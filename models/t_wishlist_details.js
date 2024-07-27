"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class T_Wishlist_Details extends Model {
    static associate(models) {
      T_Wishlist_Details.belongsTo(models.T_Wishlists, {
        foreignKey: "wishlist_id",
        as: "T_Wishlists",
      });

      T_Wishlist_Details.belongsTo(models.M_Products, {
        foreignKey: "product_id",
        as: "product",
      });

      T_Wishlist_Details.belongsTo(models.M_Variations, {
        foreignKey: "variant_id",
        as: "variation",
      });
    }
  }
  T_Wishlist_Details.init(
    {
      wishlist_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      variant_id: DataTypes.INTEGER,
      price: DataTypes.FLOAT,
      qty: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "T_Wishlist_Details",
      paranoid: false,
    }
  );
  return T_Wishlist_Details;
};
