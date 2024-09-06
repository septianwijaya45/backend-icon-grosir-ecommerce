'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn("T_Wishlist_Details", "varian", {
        type: Sequelize.DataTypes.STRING,
        after: 'qty'
      }),
      queryInterface.addColumn("T_Wishlist_Details", "warna", {
        type: Sequelize.DataTypes.STRING,
        after: 'qty'
      }),
      queryInterface.addColumn("T_Wishlist_Details", "ukuran", {
        type: Sequelize.DataTypes.STRING,
        after: 'qty'
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn("T_Wishlist_Details", "varian"),
      queryInterface.removeColumn("T_Wishlist_Details", "warna"),
      queryInterface.removeColumn("T_Wishlist_Details", "ukuran"),
    ]);
  }
};
