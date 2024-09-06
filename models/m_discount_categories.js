"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class M_Discount_Categories extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      M_Discount_Categories.belongsTo(models.M_Categories, {
        foreignKey: "category_id",
        as: "M_Categories",
      });
    }
  }
  M_Discount_Categories.init(
    {
      category_id: DataTypes.INTEGER,
      diskon_persen: DataTypes.INTEGER,
      diskon_harga: DataTypes.FLOAT,
      start_date: DataTypes.DATE,
      end_Date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "M_Discount_Categories",
      paranoid: true,
    }
  );
  return M_Discount_Categories;
};
