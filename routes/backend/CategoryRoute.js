const {
  getAllCategory,
  createCategory,
  getCategoryById,
  updateCategory,
  deleteCategory,
} = require("../../controllers/Master/CategoriesController");

const router = require("express").Router();

router.route("/get-data").get(getAllCategory);
router.route("/create-data").post(createCategory);
router.route("/get-data/:id").put(getCategoryById);
router.route("/update-data/:id").patch(updateCategory);
router.route("/delete-data/:id").delete(deleteCategory);

module.exports = router;
