const {
  getAllVariation,
  createVariation,
  getVariationById,
  updateVariation,
  deleteVariation,
} = require("../controllers/Master/VariationController");

const router = require("express").Router();

router.route("/get-data").get(getAllVariation);
router.route("/create-data").post(createVariation);
router.route("/get-data/:id").put(getVariationById);
router.route("/update-data/:id").patch(updateVariation);
router.route("/delete-data/:id").delete(deleteVariation);

module.exports = router;
