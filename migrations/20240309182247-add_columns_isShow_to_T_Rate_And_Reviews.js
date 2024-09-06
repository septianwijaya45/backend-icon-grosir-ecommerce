"use strict";

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn("T_Rate_And_Reviews", "isShow", {
      type: Sequelize.DataTypes.INTEGER,
      allowNull: false,
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn("T_Rate_And_Reviews", "isShow");
  },
};
