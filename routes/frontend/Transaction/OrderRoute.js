const { getMyOrder } = require("../../../controllers/Frontoffice/Transaction/OrderController");
const { authenticateToken } = require("../../../middleware/authMiddleware");

const router = require("express").Router();
router.use(authenticateToken);

router.route("/get-cart").get(getMyOrder);


module.exports = router;