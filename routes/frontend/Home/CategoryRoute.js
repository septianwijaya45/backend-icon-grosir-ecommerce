const {
  getFiveCategory,
  getTreeCategory,
} = require("../../../controllers/Frontoffice/Category/CategoryController");

const router = require("express").Router();

router.route("/get-five-categories").get(getFiveCategory);
router.route("/get-three-categories").get(getTreeCategory);

module.exports = router;
