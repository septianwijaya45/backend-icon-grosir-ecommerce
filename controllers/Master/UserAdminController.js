const asyncHandler = require("express-async-handler");
const { Users, M_Admins } = require("../../models/");
const { v4: uuidv4 } = require("uuid");

const getAllAdminUser = asyncHandler(async (req, res) => {
  try {
    const getDataUser = await Users.findAll({
      include: [
        {
          model: M_Admins,
          as: "M_Admins",
          required: true,
        },
      ],
    });

    res.status(201).json({
      message: "Get Data Success!",
      data: getDataUser,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const createAdminUser = asyncHandler(async (req, res) => {
  try {
    const {
      name,
      username,
      email,
      password,
      picture,
      jenis_kelamin,
      alamat,
      no_telepon,
    } = req.body;

    const userExists = await Users.findOne({ where: { email: email } });

    if (userExists) {
      res.status(404);
      throw new Error("User Already Exists");
    }

    const userData = {
      uuid: uuidv4(),
      role_id: 2,
      username: username,
      email: email,
      password: password,
      picture: !picture ? "default.png" : picture,
    };

    const user = await Users.create(userData);

    const adminData = {
      user_id: user.id,
      nama: name,
      jenis_kelamin: jenis_kelamin,
      alamat: alamat,
      no_telepon: no_telepon,
    };
    const admin = await M_Admins.create(adminData);

    res.status(201).json({
      message: "Success When Insert Data!",
      data: { user, admin },
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const getAdminUserById = asyncHandler(async (req, res) => {
  try {
    const { uuid } = req.params;
    let dataAdminUser = await Users.findOne({
      where: { uuid: uuid }, 
      include: [
        {
          model: M_Admins,
          as: "M_Admins",
          required: true,
        },
      ],
    });

    if (!dataAdminUser) {
      res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    res.status(200).json({
      data: dataAdminUser,
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const updateAdminUser = asyncHandler(async (req, res) => {
  try {
    const { uuid } = req.params;
    const {
      name,
      username,
      email,
      password,
      picture,
      jenis_kelamin,
      alamat,
      no_telepon,
    } = req.body;

    let dataAdminUser = await Users.findOne({ uuid: uuid });

    if (!dataAdminUser) {
      res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    const userData = {
      username: username,
      email: email,
      password: password,
      picture: !picture ? "default.png" : picture,
    };

    const adminData = {
      nama: name,
      jenis_kelamin: jenis_kelamin,
      alamat: alamat,
      no_telepon: no_telepon,
    };

    await Users.findOne({ uuid: uuid })
      .then((user) => {
        return user.update(userData);
      })
      .then((updatedUser) => {
        return M_Admins.findOne({ where: { user_id: updatedUser.id } });
      })
      .then((admin) => {
        if (admin) {
          return admin.update(adminData);
        }
        console.log("Tidak ada entri Admin yang sesuai untuk diperbarui");
      })
      .catch((error) => {
        console.error("Error updating data:", error);
      });

    res.status(200).json({
      message: "Data Berhasil Diupdate!",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const deleteAdminUser = asyncHandler(async (req, res) => {
  try {
    const { uuid } = req.params;

    let user = await Users.findOne({ uuid: uuid });

    if (!user) {
      res.status(500).json({
        message: "Data Tidak Ditemukan!",
      });
    }

    const admin = await M_Admins.findOne({ where: { user_id: user.id } });
    if (admin) {
      await admin.destroy();
    }
    await user.destroy();

    res.status(200).json({
      message: "Data Berhasil Dihapus!",
    });
  } catch (error) {
    console.error(error.message);
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

module.exports = {
  getAllAdminUser,
  createAdminUser,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser,
};
