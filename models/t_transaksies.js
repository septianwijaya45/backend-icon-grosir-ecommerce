"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class T_Transaksies extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      T_Transaksies.belongsTo(models.User_Ecommerces, {
        foreignKey: "user_ecommerce_id",
        as: "User_Ecommerces",
      });
      T_Transaksies.hasMany(models.T_Transaksi_Details, {
        foreignKey: "transaksi_id",
        as: "T_Transaksi_Details",
      });
    }
  }
  T_Transaksies.init(
    {
      uuid: DataTypes.UUID,
      user_ecommerce_id: DataTypes.INTEGER,
      ekspedisi_id: DataTypes.INTEGER,
      kode_invoice: DataTypes.STRING,
      grand_total: DataTypes.FLOAT,
      grand_total_setelah_diskon: DataTypes.FLOAT,
      tanggal_checkout: DataTypes.DATE,
      konfirmasi_admin: DataTypes.BOOLEAN,
    },
    {
      sequelize,
      modelName: "T_Transaksies",
    }
  );
  return T_Transaksies;
};
