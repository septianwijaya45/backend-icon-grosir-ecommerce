const { createCart, createWishlistCart, getCart, deleteCart, updateCart } = require("../../../controllers/Frontoffice/Transaction/CartController");
const { authenticateToken } = require("../../../middleware/authMiddleware");

const router = require("express").Router();
router.use(authenticateToken);

router.route("/get-cart").get(getCart);
router.route("/create-cart/:id").get(createCart);
router.route("/update-qty-cart/:id/:uuid/:variant_id").post(updateCart);
router.route("/create-cart-by-wishlist/:id/:uuid/:variant_id").get(createWishlistCart);
router.route("/delete-cart/:id").delete(deleteCart);

module.exports = router;
