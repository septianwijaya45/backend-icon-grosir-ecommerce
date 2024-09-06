'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn("T_Cart_Details", "variant_id", {
        type: Sequelize.DataTypes.INTEGER,
        after: 'product_id'
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn("T_Cart_Details", "variant_id"),
    ]);
  }
};
