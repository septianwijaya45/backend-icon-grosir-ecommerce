const { registerUser, loginUser, logout, refreshToken, confirmOtp, resendOtp, getConfirmOtp } = require("../../../controllers/Authentication/AuthFrontendController");
const {
  resetPassword,
} = require("../../../controllers/Authentication/UserController");

const router = require("express").Router();
router.route("/reset-password/:id").put(resetPassword);
router.route("/login").post(loginUser);
router.route("/logout").post(logout);
router.route("/refresh-token").post(refreshToken);
router.route("/register").post(registerUser);
router.route("/confirm-otp").post(confirmOtp);
router.route("/resend-otp").post(resendOtp);

router.route("/get-confirm-otp").post(getConfirmOtp);

module.exports = router;
