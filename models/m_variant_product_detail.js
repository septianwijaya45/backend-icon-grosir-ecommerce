'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class M_Variant_Product_Detail extends Model {
    static associate(models) {
      M_Variant_Product_Detail.belongsTo(models.M_Variations, {
        foreignKey: "variation_id",
        as: "variation_detail",
      });

      M_Variant_Product_Detail.belongsTo(models.M_Products, {
        foreignKey: "product_id",
        as: "product_variation_detail",
      });

      M_Variant_Product_Detail.belongsTo(models.T_Stocks, {
        foreignKey: "product_id",
        as: "t_stok_details",
      });
      M_Variant_Product_Detail.hasMany(models.M_Photo_Products, {
        foreignKey: "product_id",
        as: "photos",
      });
    }
  }
  M_Variant_Product_Detail.init(
    {
      variation_id: DataTypes.INTEGER,
      product_id: DataTypes.INTEGER,
      variasi_detail: DataTypes.STRING,
      warna: DataTypes.STRING,
      ukuran: DataTypes.STRING,
      lain_lain: DataTypes.STRING,
      harga: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "M_Variant_Product_Detail",
      paranoid: true,
    }
  );
  return M_Variant_Product_Detail;
};
