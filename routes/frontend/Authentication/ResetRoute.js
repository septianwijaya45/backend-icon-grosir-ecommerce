const { getUserByEmail, resetPassword } = require("../../../controllers/Authentication/ResetUserController");

const router = require("express").Router();

router.route('/get-user-by-email').post(getUserByEmail)
router.route('/reset-password/:token').post(resetPassword)

module.exports = router;