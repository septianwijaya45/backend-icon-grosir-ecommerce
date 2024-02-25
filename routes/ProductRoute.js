const {
  getAllProduct,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
} = require("../controllers/Master/ProductController");

const router = require("express").Router();

router.route("/get-data").get(getAllProduct);
router.route("/create-data").post(createProduct);
router.route("/get-data/:id").put(getProductById);
router.route("/update-data/:uuid").patch(updateProduct);
router.route("/delete-data/:id").delete(deleteProduct);

module.exports = router;
