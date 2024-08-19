const { createWishlist, getWishlist, deleteWishlist, updateQtyWishlist } = require("../../../controllers/Frontoffice/Transaction/WishlistController");
const { authenticateToken } = require("../../../middleware/authMiddleware");


const router = require("express").Router();
router.use(authenticateToken);

router.route("/get-wishlist").get(getWishlist);
router.route("/create-wishlist/:id").get(createWishlist);
router.route("/update-wishlist/:product_id/:variant_id/:warna/:ukuran/:wishlish/:qty").get(updateQtyWishlist);
router.route("/delete-wishlist/:id").delete(deleteWishlist);

module.exports = router;
