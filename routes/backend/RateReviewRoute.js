const {
  getAllRateReviews,
  createRateReviews,
  getRateReviewById,
  updateRateReview,
  deleteRateReview,
} = require("../../controllers/Transaction/Rate&ReviewController");
const { authenticateToken } = require("../../middleware/authMiddleware");

const router = require("express").Router();

router.use(authenticateToken);

router.route("/get-data").get(getAllRateReviews);
router.route("/create-data").post(createRateReviews);
router.route("/get-data/:id").put(getRateReviewById);
router.route("/update-data/:id").patch(updateRateReview);
router.route("/delete-data/:id").delete(deleteRateReview);

module.exports = router;
