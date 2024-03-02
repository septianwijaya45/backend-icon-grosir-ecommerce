"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class M_Admins extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      M_Admins.belongsTo(models.Users, {
        foreignKey: "user_id",
        as: "Users",
      });
    }
  }
  M_Admins.init(
    {
      user_id: DataTypes.INTEGER,
      nama: DataTypes.STRING,
      jenis_kelamin: DataTypes.STRING,
      alamat: DataTypes.TEXT,
      no_telepon: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "M_Admins",
      paranoid: true,
    }
  );
  return M_Admins;
};
