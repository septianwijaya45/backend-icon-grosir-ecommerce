const { getAllDiscountCategory, createDiscountCategory, getDiscountCategoryById, updateDiscountCategory, deleteDiscountCategory } = require("../controllers/Master/DiscountCategoriesController");


const router = require("express").Router();

router.route("/get-data").get(getAllDiscountCategory);
router.route("/create-data").post(createDiscountCategory);
router.route("/get-data/:id").put(getDiscountCategoryById);
router.route("/update-data/:id").patch(updateDiscountCategory);
router.route("/delete-data/:id").delete(deleteDiscountCategory);

module.exports = router;
