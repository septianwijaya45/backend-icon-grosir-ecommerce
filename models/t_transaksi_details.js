"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class T_Transaksi_Details extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      T_Transaksi_Details.belongsTo(models.T_Transaksies, {
        foreignKey: "transaksi_id",
        as: "T_Transaksies",
      });
      T_Transaksi_Details.belongsTo(models.M_Products, {
        foreignKey: "product_id",
        as: "M_Products",
      });
    }
  }
  T_Transaksi_Details.init(
    {
      transaksi_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      qty: DataTypes.INTEGER,
      total_harga: DataTypes.FLOAT,
    },
    {
      sequelize,
      modelName: "T_Transaksi_Details",
    }
  );
  return T_Transaksi_Details;
};
