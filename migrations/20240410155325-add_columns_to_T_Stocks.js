'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn("T_Stocks", "variation_id", {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: true,
      }),
      queryInterface.addColumn("T_Stocks", "warna", {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("T_Stocks", "ukuran", {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      }),
      queryInterface.addColumn("T_Stocks", "lain_lain", {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
      })
    ]);
  },

  async down(queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn("T_Stocks", "variation_id"),
      queryInterface.removeColumn("T_Stocks", "warna"),
      queryInterface.removeColumn("T_Stocks", "ukuran"),
      queryInterface.removeColumn("T_Stocks", "lain_lain"),
    ]);
  },
};
