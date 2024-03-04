const {
  getAllSize,
  createSize,
  getSizeById,
  updateSize,
  deleteSize,
} = require("../../controllers/Master/SizesController");

const router = require("express").Router();

router.route("/get-data").get(getAllSize);
router.route("/create-data").post(createSize);
router.route("/get-data/:id").put(getSizeById);
router.route("/update-data/:id").patch(updateSize);
router.route("/delete-data/:id").delete(deleteSize);

module.exports = router;
