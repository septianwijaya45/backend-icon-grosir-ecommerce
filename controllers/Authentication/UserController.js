const asyncHandler = require("express-async-handler");
const { Users } = require("../../models/");

const resetPassword = asyncHandler(async (req, res) => {
  try {
    const { uuid } = req.params;

    let password = "admin123";
    let user = await Users.findOne({ uuid: uuid });

    if (!dataAdminUser) {
      res.status(500).json({
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

    res.status(200).json({
      message: "User Admin Berhasil Reset Password!",
    });
  } catch (error) {
    res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

module.exports = {
  resetPassword,
};
