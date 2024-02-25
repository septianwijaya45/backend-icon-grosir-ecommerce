"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable("M_Products", {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER,
      },
      uuid: {
        type: Sequelize.UUID,
      },
      category_id: {
        type: Sequelize.INTEGER,
      },
      nama_barang: {
        type: Sequelize.STRING,
      },
      artikel: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      deskripsi: {
        type: Sequelize.TEXT,
        allowNull: true,
      },
      harga: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      minimum_pemesanan: {
        type: Sequelize.INTEGER,
        allowNull: true,
      },
      satuan_berat: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      diskon_tipe: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status_barang: {
        type: Sequelize.INTEGER,
        allowNull: true,
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
    await queryInterface.dropTable("M_Products");
  },
};
