const { createCart, createWishlistCart, getCart, deleteCart, updateCart, getVarianById, getWarnaById, getUkuranById, getHargaById } = require("../../../controllers/Frontoffice/Transaction/CartController");
const { authenticateToken } = require("../../../middleware/authMiddleware");

const router = require("express").Router();
router.use(authenticateToken);

router.route("/get-cart").get(getCart);
router.route("/create-cart/:id").get(createCart);
router.route("/update-qty-cart/:id/:uuid/:variant_id").post(updateCart);
router.route("/create-cart-by-wishlist/:id/:uuid/:variant_id").get(createWishlistCart);
router.route("/delete-cart/:id").delete(deleteCart);


router.route("/get-varian/:product_id").get(getVarianById);
router.route("/get-warna/:product_id/:variant_id/:cart").get(getWarnaById);
router.route("/get-ukuran/:product_id/:variant_id/:warna/:cart").get(getUkuranById);
router.route("/get-harga/:product_id/:variant_id/:warna/:ukuran/:cart").get(getHargaById);

module.exports = router;
