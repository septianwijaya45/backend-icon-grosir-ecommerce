"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class M_Customers extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      M_Customers.belongsTo(models.User_Ecommerces, {
        foreignKey: "user_ecommerce_id",
        as: "User_Ecommerces",
      });
    }
  }
  M_Customers.init(
    {
      user_ecommerce_id: DataTypes.INTEGER,
      first_name: DataTypes.STRING,
      last_name: DataTypes.STRING,
      no_telepon: DataTypes.STRING,
      alamat: DataTypes.TEXT,
      kota: DataTypes.STRING,
      kode_pos: DataTypes.STRING,
      foto_profil: DataTypes.TEXT,
    },
    {
      sequelize,
      modelName: "M_Customers",
      paranoid: true,
    }
  );
  return M_Customers;
};
