'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn("M_Products", "image", {
        type: Sequelize.DataTypes.TEXT,
        after: 'status_barang'
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn("M_Products", "image"),
    ]);
  }
};
