const {
  getAllVariation,
  createVariation,
  getVariationById,
  updateVariation,
  deleteVariation,
  getVariationDetails,
} = require("../../controllers/Master/VariationController");
const { authenticateToken } = require("../../middleware/authMiddleware");

const router = require("express").Router();

router.use(authenticateToken);

router.route("/get-data").get(getAllVariation);
router.route("/create-data").post(createVariation);
router.route("/get-data/:id").put(getVariationById);
router.route("/update-data/:id").patch(updateVariation);
router.route("/delete-data/:id").delete(deleteVariation);
router
  .route("/detail-data-variation/:variation_id/:product_id")
  .get(getVariationDetails);

module.exports = router;
