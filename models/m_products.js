"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class M_Products extends Model {
    static associate(models) {
      M_Products.belongsToMany(models.M_Variations, {
        through: "M_Variation_Products",
        foreignKey: "product_id",
      });
      M_Products.belongsToMany(models.M_Sizes, {
        through: "M_Size_Products",
        foreignKey: "product_id",
      });
      M_Products.belongsToMany(models.M_Tags, {
        through: "M_Tag_Products",
        foreignKey: "product_id",
      });
      M_Products.belongsTo(models.M_Sizes, {
        foreignKey: "category_id",
        as: "M_Categories",
      });
      M_Products.hasMany(models.M_Photo_Products, {
        foreignKey: "product_id",
        as: "photos",
      });
      M_Products.hasOne(models.M_Discount_Products, {
        foreignKey: "product_id",
        as: "M_Discount_Products",
      });
      M_Products.hasOne(models.T_Stocks, {
        foreignKey: "product_id",
        as: "T_Stocks",
      });
      M_Products.hasMany(models.T_Rate_And_Reviews, {
        foreignKey: "product_id",
        as: "T_Rate_And_Reviews",
      });
      M_Products.hasMany(models.T_Transaksi_Details, {
        foreignKey: "product_id",
        as: "T_Transaksi_Details",
      });
      M_Products.hasMany(models.T_Wishlist_Details, {
        foreignKey: "product_id",
        as: "wishlistDetails",
      });
    }
  }
  M_Products.init(
    {
      uuid: DataTypes.UUID,
      category_id: DataTypes.INTEGER,
      nama_barang: DataTypes.STRING,
      artikel: DataTypes.STRING,
      deskripsi: DataTypes.TEXT,
      deskripsi_detail: DataTypes.TEXT,
      harga: DataTypes.INTEGER,
      minimum_pemesanan: DataTypes.INTEGER,
      satuan_berat: DataTypes.STRING,
      diskon_tipe: DataTypes.STRING,
      status_barang: DataTypes.INTEGER
    },
    {
      sequelize,
      modelName: "M_Products",
      paranoid: true
    }
  );
  return M_Products;
};
