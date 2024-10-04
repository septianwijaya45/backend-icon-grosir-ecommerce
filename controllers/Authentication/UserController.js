const asyncHandler = require("express-async-handler");
const { Op } = require('sequelize')
const {
  sequelize,
  M_Customers,
  Users,
  User_Ecommerces
} = require("../../models/");

const getAccountDetails = asyncHandler(async (req, res) => {
  try {
    const user = await User_Ecommerces.findOne({
      where: { no_telepon: req.user.username }
    });
    const customer = await M_Customers.findOne({
      where: { user_ecommerce_id: user.id }
    })

    if (!user) {
      return res.status(404).json({
        status: false,
        message: "Pengguna tidak ditemukan!",
      });
    }

    return res.status(200).json({
      status: true,
      user: user,
      detail: customer
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const updateAccount = asyncHandler(async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      no_telepon,
      jenis_kelamin,
      kota,
      kode_pos,
      alamat,
      picture
    } = req.body;

    const account = {
      name,
      email,
      username: no_telepon
    };

    const updateCustomer = {
      user_ecommerce_id: id,
      no_telepon,
      alamat,
      kota,
      kode_pos,
      jenis_kelamin,
      foto_profil: picture || "default.png",
    };

    const user = await User_Ecommerces.findOne({ where: { id } });
    if (!user) {
      return res.status(404).json({
        status: false,
        message: "User tidak ditemukan!",
      });
    }

    await user.update(account);

    const customer = await M_Customers.findOne({
      where: { user_ecommerce_id: id }
    });

    if (!customer) {
      await M_Customers.create(updateCustomer);
    } else {
      await customer.update(updateCustomer);
    }

    return res.status(200).json({
      message: "Data Berhasil Diupdate!",
      status: true,
      user: User_Ecommerces.findOne({ where: { id } }),
      detail: await M_Customers.findOne({
        where: { user_ecommerce_id: id }
      })
    });

  } catch (error) {
    console.error(error);
    return res.status(500).json({
      status: false,
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});


const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { uuid } = req.params;

    let password = "admin123";
    let user = await Users.findOne({ uuid: uuid });

    if (!dataAdminUser) {
      return res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    await Users.findOne({ uuid: uuid })
      .then((user) => {
        return user.update({
          password: password,
        });
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });

    return res.status(200).json({
      message: "User Admin Berhasil Reset Password!",
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

module.exports = {
  resetPassword,
  getAccountDetails,
  updateAccount
};
