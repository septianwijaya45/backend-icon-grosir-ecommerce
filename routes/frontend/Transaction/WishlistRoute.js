const { createWishlist, getWishlist, deleteWishlist } = require("../../../controllers/Frontoffice/Transaction/WishlistController");
const { authenticateToken } = require("../../../middleware/authMiddleware");


const router = require("express").Router();
router.use(authenticateToken);

router.route("/get-wishlist").get(getWishlist);
router.route("/create-wishlist/:id").get(createWishlist);
router.route("/delete-wishlist/:id").delete(deleteWishlist);

module.exports = router;
