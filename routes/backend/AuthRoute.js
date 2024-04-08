const { loginUser, logout, refreshToken } = require("../../controllers/Authentication/AuthBackendController");
const {
  resetPassword,
} = require("../../controllers/Authentication/UserController");

const router = require("express").Router();
router.route("/reset-password/:id").put(resetPassword);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/refresh-token").post(refreshToken);

module.exports = router;
