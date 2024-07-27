const {
  resetPassword,
  getAccountDetails,
  updateAccount
} = require("../../../controllers/Authentication/UserController");
const { authenticateToken } = require("../../../middleware/authMiddleware");

const router = require("express").Router();
router.use(authenticateToken);

router.route("/my-account").get(getAccountDetails);
router.route("/my-account/update/:id").post(updateAccount);
module.exports = router;
