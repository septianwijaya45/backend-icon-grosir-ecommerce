const { createCheckout, getTransaksi, processCheckout } = require("../../../controllers/Frontoffice/Transaction/CheckoutController");
const { authenticateToken } = require("../../../middleware/authMiddleware");


const router = require("express").Router();
router.use(authenticateToken);

router.route("/get-checkout").get(getTransaksi);
router.route('/create-checkout').post(createCheckout)
router.route("/confirm-pesanan").post(processCheckout);

module.exports = router;