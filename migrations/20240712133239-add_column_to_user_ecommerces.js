'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.addColumn("User_Ecommerces", "no_telepon", {
        type: Sequelize.DataTypes.TEXT,
        after: 'name'
      }),
    ]);
  },

  async down (queryInterface, Sequelize) {
    await Promise.all([
      queryInterface.removeColumn("User_Ecommerces", "no_telepon"),
    ]);
  }
};
