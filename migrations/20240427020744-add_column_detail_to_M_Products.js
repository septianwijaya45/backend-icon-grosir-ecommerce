'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn("M_Products", "deskripsi_detail", {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        after: 'deskripsi'
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn("M_Products", "deskripsi_detail"),
    ]);
  }
};
