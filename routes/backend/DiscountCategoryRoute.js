const {
  getAllDiscountCategory,
  createDiscountCategory,
  getDiscountCategoryById,
  updateDiscountCategory,
  deleteDiscountCategory,
} = require("../../controllers/Backoffice/Master/DiscountCategoriesController");
const { authenticateToken } = require("../../middleware/authMiddleware");

const router = require("express").Router();

router.use(authenticateToken);

router.route("/get-data").get(getAllDiscountCategory);
router.route("/create-data").post(createDiscountCategory);
router.route("/get-data/:id").put(getDiscountCategoryById);
router.route("/update-data/:id").patch(updateDiscountCategory);
router.route("/delete-data/:id").delete(deleteDiscountCategory);

module.exports = router;
