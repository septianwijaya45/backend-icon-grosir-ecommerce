const { getTransaksi, confirmData, detailTransaksi } = require("../../controllers/Backoffice/Transaction/TransactionController");
const { authenticateToken } = require("../../middleware/authMiddleware");

const router = require("express").Router();

router.use(authenticateToken);

router.route('/get-data').get(getTransaksi)
router.route('/detail-data/:kode_invoice/:user_id').get(detailTransaksi)
router.route('/confirm-data/:kode_invoice/:user_id').get(confirmData)

module.exports = router;