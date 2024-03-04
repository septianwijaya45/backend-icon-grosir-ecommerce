const { getAllDiscountProduct, createDiscountProduct, getDiscountProductById, updateDiscountProduct, deleteDiscountProduct } = require("../controllers/Master/DiscountProductsController");


const router = require("express").Router();

router.route("/get-data").get(getAllDiscountProduct);
router.route("/create-data").post(createDiscountProduct);
router.route("/get-data/:id").put(getDiscountProductById);
router.route("/update-data/:id").patch(updateDiscountProduct);
router.route("/delete-data/:id").delete(deleteDiscountProduct);

module.exports = router;
