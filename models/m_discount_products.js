"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class M_Discount_Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      M_Discount_Products.belongsTo(models.M_Products, {
        foreignKey: "product_id",
        as: "M_Products",
      });
    }
  }
  M_Discount_Products.init(
    {
      product_id: DataTypes.INTEGER,
      diskon_persen: DataTypes.INTEGER,
      diskon_harga: DataTypes.FLOAT,
      start_date: DataTypes.DATE,
      end_Date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "M_Discount_Products",
    }
  );
  return M_Discount_Products;
};
