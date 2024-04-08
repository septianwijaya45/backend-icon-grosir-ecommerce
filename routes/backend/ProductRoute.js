const {
  getAllProduct,
  createProduct,
  getProductById,
  updateProduct,
  deleteProduct,
  syncProduct,
} = require("../../controllers/Master/ProductController");
const { authenticateToken } = require("../../middleware/authMiddleware");

const router = require("express").Router();

router.use(authenticateToken);

router.route("/get-data").get(getAllProduct);
router.route("/sync-data").get(syncProduct);
router.route("/create-data").post(createProduct);
router.route("/get-data/:id").put(getProductById);
router.route("/update-data/:uuid").patch(updateProduct);
router.route("/delete-data/:uuid").delete(deleteProduct);

module.exports = router;
