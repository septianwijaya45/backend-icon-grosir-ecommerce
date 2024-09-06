"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class M_Tags extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      M_Tags.belongsToMany(models.M_Products, {
        through: "M_Tag_Products",
        foreignKey: "tag_id",
      });
    }
  }
  M_Tags.init(
    {
      tag: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "M_Tags",
      paranoid: true,
    }
  );
  return M_Tags;
};
