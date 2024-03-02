"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class M_Variations extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      M_Variations.belongsToMany(models.M_Products, {
        through: "M_Variation_Products",
        foreignKey: "variation_id",
      });
    }
  }
  M_Variations.init(
    {
      variasi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "M_Variations",
      paranoid: true,
    }
  );
  return M_Variations;
};
