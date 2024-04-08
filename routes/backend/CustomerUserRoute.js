const {
  getAllCustomer,
  createCustomer,
  updateCustomer,
  getCustomerById,
  deleteCustomer,
} = require("../../controllers/Master/CustomerController");
const { authenticateToken } = require("../../middleware/authMiddleware");

const router = require("express").Router();

router.use(authenticateToken);

router.route("/get-data").get(getAllCustomer);
router.route("/create-data").post(createCustomer);
router.route("/get-data/:uuid").put(getCustomerById);
router.route("/update-data/:uuid").patch(updateCustomer);
router.route("/delete-data/:uuid").delete(deleteCustomer);

module.exports = router;
