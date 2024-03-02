"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class T_Cart_Details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      T_Cart_Details.belongsTo(models.T_Carts, {
        foreignKey: "cart_id",
        as: "T_Carts",
      });
    }
  }
  T_Cart_Details.init(
    {
      cart_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      price: DataTypes.FLOAT,
      qty: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "T_Cart_Details",
      paranoid: true,
    }
  );
  return T_Cart_Details;
};
