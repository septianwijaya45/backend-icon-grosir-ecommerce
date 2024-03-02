"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class M_Sizes extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      M_Sizes.belongsToMany(models.M_Products, {
        through: "M_Size_Products",
        foreignKey: "size_id",
      });
    }
  }
  M_Sizes.init(
    {
      size: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "M_Sizes",
      paranoid: true,
    }
  );
  return M_Sizes;
};
