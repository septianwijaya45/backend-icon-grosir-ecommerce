'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class user_confirm_otp extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  user_confirm_otp.init({
    user_ecommerce_id: DataTypes.INTEGER,
    kode_otp: DataTypes.INTEGER,
    kode_otp_confirm: DataTypes.INTEGER,
    expired_date: DataTypes.DATE
  }, {
    sequelize,
    modelName: 'user_confirm_otp',
  });
  return user_confirm_otp;
};