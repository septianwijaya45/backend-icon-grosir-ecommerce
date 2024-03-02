"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class M_Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      M_Categories.hasOne(models.M_Products, {
        foreignKey: "category_id",
        as: "M_Products",
      });
      M_Categories.hasOne(models.M_Discount_Categories, {
        foreignKey: "category_id",
        as: "M_Discount_Categories",
      });
    }
  }
  M_Categories.init(
    {
      category: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "M_Categories",
      paranoid: true,
    }
  );
  return M_Categories;
};
