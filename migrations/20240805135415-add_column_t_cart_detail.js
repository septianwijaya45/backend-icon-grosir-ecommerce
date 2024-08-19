'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn("t_cart_details", "varian", {
        type: Sequelize.DataTypes.STRING,
        after: 'qty'
      }),
      queryInterface.addColumn("t_cart_details", "warna", {
        type: Sequelize.DataTypes.STRING,
        after: 'varian'
      }),
      queryInterface.addColumn("t_cart_details", "ukuran", {
        type: Sequelize.DataTypes.STRING,
        after: 'warna'
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn("t_cart_details", "varian"),
      queryInterface.removeColumn("t_cart_details", "warna"),
      queryInterface.removeColumn("t_cart_details", "ukuran"),
    ]);
  }
};
