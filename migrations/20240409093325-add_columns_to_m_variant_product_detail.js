'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn("M_Variant_Product_Details", "warna", {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("M_Variant_Product_Details", "ukuran", {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("M_Variant_Product_Details", "lain_lain", {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("M_Variant_Product_Details", "harga", {
        type: Sequelize.DataTypes.DECIMAL(10, 2),
        allowNull: true,
      }),
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn("M_Variant_Product_Details", "warna"),
      queryInterface.removeColumn("M_Variant_Product_Details", "ukuran"),
      queryInterface.removeColumn("M_Variant_Product_Details", "lain_lain"),
      queryInterface.removeColumn("M_Variant_Product_Details", "harga"),
    ]);
  },
};

