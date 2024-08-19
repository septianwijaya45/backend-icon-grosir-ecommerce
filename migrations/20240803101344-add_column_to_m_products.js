'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn("m_products", "image", {
        type: Sequelize.DataTypes.TEXT,
        after: 'status_barang'
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn("m_products", "image"),
    ]);
  }
};
