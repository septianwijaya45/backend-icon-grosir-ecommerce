const {
  getAllDiscountProduct,
  createDiscountProduct,
  getDiscountProductById,
  updateDiscountProduct,
  deleteDiscountProduct,
} = require("../../controllers/Master/DiscountProductsController");
const { authenticateToken } = require("../../middleware/authMiddleware");

const router = require("express").Router();

router.use(authenticateToken);

router.route("/get-data").get(getAllDiscountProduct);
router.route("/create-data").post(createDiscountProduct);
router.route("/get-data/:id").put(getDiscountProductById);
router.route("/update-data/:id").patch(updateDiscountProduct);
router.route("/delete-data/:id").delete(deleteDiscountProduct);

module.exports = router;
