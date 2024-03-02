"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class T_Rate_And_Reviews extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      T_Rate_And_Reviews.belongsTo(models.M_Products, {
        foreignKey: "product_id",
        as: "M_Products",
      });
    }
  }
  T_Rate_And_Reviews.init(
    {
      user_ecommerce_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      foto_review: DataTypes.STRING,
      rating: DataTypes.FLOAT,
      review_deskripsi: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "T_Rate_And_Reviews",
      paranoid: true,
    }
  );
  return T_Rate_And_Reviews;
};
