"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class M_Photo_Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      M_Photo_Products.belongsTo(models.M_Products, {
        foreignKey: "product_id",
        as: "products",
      });
    }
  }
  M_Photo_Products.init(
    {
      product_id: DataTypes.INTEGER,
      varian_product_detail_id: DataTypes.INTEGER,
      nama_file: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "M_Photo_Products",
      paranoid: true,
    }
  );
  return M_Photo_Products;
};
