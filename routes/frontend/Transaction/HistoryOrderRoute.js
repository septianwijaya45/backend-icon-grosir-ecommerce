const { getHistoryTransaction } = require("../../../controllers/Frontoffice/Transaction/HistoryOrderController");
const { authenticateToken } = require("../../../middleware/authMiddleware");


const router = require("express").Router();
router.use(authenticateToken);

router.route("/get-history-cart").get(getHistoryTransaction);


module.exports = router;