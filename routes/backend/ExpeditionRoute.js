const {
  getAllExpedition,
  createExpedition,
  getExpeditionById,
  updateExpedition,
  deleteExpedition,
} = require("../../controllers/Master/ExpeditionController");
const { authenticateToken } = require("../../middleware/authMiddleware");

const router = require("express").Router();

router.use(authenticateToken);

router.route("/get-data").get(getAllExpedition);
router.route("/create-data").post(createExpedition);
router.route("/get-data/:id").put(getExpeditionById);
router.route("/update-data/:id").patch(updateExpedition);
router.route("/delete-data/:id").delete(deleteExpedition);

module.exports = router;
