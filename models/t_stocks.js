'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class T_Stocks extends Model {
    static associate(models) {
      T_Stocks.belongsTo(models.M_Products, {
        foreignKey: "product_id",
        as: "M_Products",
      });

      T_Stocks.belongsTo(models.M_Variations, {
        foreignKey: "variation_id",
        as: "variation",
      });
    }
  }
  T_Stocks.init(
    {
      variation_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      stock: DataTypes.INTEGER,
      warna: DataTypes.STRING,
      ukuran: DataTypes.STRING,
      lain_lain: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "T_Stocks",
      paranoid: true,
    }
  );
  return T_Stocks;
};
