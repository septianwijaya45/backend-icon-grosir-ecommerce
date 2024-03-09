'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("M_Customers", "jenis_kelamin", {
      type: Sequelize.DataTypes.STRING,
      allowNull: false
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("M_Customers", "jenis_kelamin");
  }
};
