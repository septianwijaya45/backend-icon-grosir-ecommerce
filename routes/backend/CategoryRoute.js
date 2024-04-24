const {
  getAllCategory,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../../controllers/Backoffice/Master/CategoriesController");
const { authenticateToken } = require("../../middleware/authMiddleware");

const router = require("express").Router();

router.use(authenticateToken);

router.route("/get-data").get(getAllCategory);
router.route("/create-data").post(createCategory);
router.route("/get-data/:id").put(getCategoryById);
router.route("/update-data/:id").patch(updateCategory);
router.route("/delete-data/:id").delete(deleteCategory);

module.exports = router;
