"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("T_Transaksies", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
      },
      user_ecommerce_id: {
        type: Sequelize.INTEGER,
      },
      ekspedisi_id: {
        type: Sequelize.INTEGER,
      },
      kode_invoice: {
        type: Sequelize.STRING,
      },
      grand_total: {
        type: Sequelize.FLOAT,
      },
      grand_total_setelah_diskon: {
        type: Sequelize.FLOAT,
      },
      tanggal_checkout: {
        type: Sequelize.DATE,
      },
      konfirmasi_admin: {
        type: Sequelize.BOOLEAN,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      deletedAt: {
        allowNull: true,
        type: Sequelize.DATE,
      },
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable("T_Transaksies");
  },
};
