const asyncHandler = require("express-async-handler");
const { Users } = require("../../models/");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const loginUser = asyncHandler(async (req, res) => {
  try {
    const { username, password } = req.body;

    let user;

    const isEmail = /\S+@\S+\.\S+/;
    let checkIfEmail = isEmail.test(username);

    checkIfEmail
      ? (user = await Users.findOne({ where: { email: username } }))
      : (user = await Users.findOne({ where: { username: username } }));

    if (!user) {
      return res.status(200).json({
        statusCode: 422,
        message: "User tidak ditemukan!",
      });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(200).json({
        success: false,
        message: "Username atau password tidak valid!",
      });
    }

    const accessToken = jwt.sign({ username: user.username }, "accesssecret", {
      expiresIn: "15h",
    });
    const refreshToken = jwt.sign(
      { username: user.username },
      "refreshsecret",
      { expiresIn: "7d" }
    );

    req.session.accessToken = accessToken;
    req.session.refreshToken = refreshToken;

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    return res.status(200).json({
      success: true,
      message: "Berhasil Login!",
      accessToken: accessToken,
    });
  } catch (error) {
    console.error(error); // Menampilkan kesalahan di konsol server
    return res.status(500).json({
      success: false,
      error: error,
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});


const refreshToken = asyncHandler(async (req, res) => {
  try {
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) throw new Error("Refresh token not found");

    jwt.verify(refreshToken, "refreshsecret", (err, user) => {
      if (err) throw new Error("Invalid refresh token");
      const accessToken = jwt.sign(
        { username: user.username },
        "accesssecret",
        { expiresIn: "15m" }
      );
      res.json({ accessToken });
    });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

const logout = asyncHandler(async (req, res) => {
  try {
    req.session.destroy();
    res.clearCookie("refreshToken");
    res.json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({
      message: "Internal Server Error! Please Contact Developer",
    });
  }
});

module.exports = {
  loginUser,
  refreshToken,
  logout,
};
