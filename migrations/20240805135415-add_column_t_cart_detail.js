'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn("T_Cart_Details", "varian", {
        type: Sequelize.DataTypes.STRING,
        after: 'qty'
      }),
      queryInterface.addColumn("T_Cart_Details", "warna", {
        type: Sequelize.DataTypes.STRING,
        after: 'varian'
      }),
      queryInterface.addColumn("T_Cart_Details", "ukuran", {
        type: Sequelize.DataTypes.STRING,
        after: 'warna'
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn("T_Cart_Details", "varian"),
      queryInterface.removeColumn("T_Cart_Details", "warna"),
      queryInterface.removeColumn("T_Cart_Details", "ukuran"),
    ]);
  }
};
