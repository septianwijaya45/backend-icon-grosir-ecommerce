'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class M_Ekspedisi extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  M_Ekspedisi.init(
    {
      ekspedisi: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "M_Ekspedisi",
      paranoid: true,
    }
  );
  return M_Ekspedisi;
};