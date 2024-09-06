'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class M_Variation_Products extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      M_Variation_Products.belongsTo(models.M_Variations, {
        foreignKey: "variation_id",
        as: "variation",
      });

      // Define association with M_Products
      M_Variation_Products.belongsTo(models.M_Products, {
        foreignKey: "product_id",
        as: "product",
      });
    }
  }
  M_Variation_Products.init(
    {
      variation_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "M_Variation_Products",
      paranoid: true,
    }
  );
  return M_Variation_Products;
};