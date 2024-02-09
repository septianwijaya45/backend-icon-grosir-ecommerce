const {
  getAllAdminUser,
  createAdminUser,
  getAdminUserById,
  updateAdminUser,
  deleteAdminUser,
} = require("../controllers/Master/UserAdminController");

const router = require("express").Router();

router.route("/get-data").get(getAllAdminUser);
router.route("/create-data").post(createAdminUser);
router.route("/get-data/:uuid").put(getAdminUserById);
router.route("/update-data/:uuid").patch(updateAdminUser);
router.route("/delete-data/:uuid").delete(deleteAdminUser);

module.exports = router;
