'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class M_Variant_Product_Detail extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      M_Variant_Product_Detail.belongsTo(models.M_Variations, {
        foreignKey: "variation_id",
        as: "variation_detail",
      });

      // Define association with M_Products
      M_Variant_Product_Detail.belongsTo(models.M_Products, {
        foreignKey: "product_id",
        as: "product_variation_detail",
      });

       M_Variant_Product_Detail.belongsTo(models.T_Stocks, {
         foreignKey: "product_id",
         as: "t_stok_details",
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