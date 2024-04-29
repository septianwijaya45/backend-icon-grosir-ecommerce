const { getProductByCategories, getProductByFeatured, getProductByLatest, getProductByPopular, getProductById } = require("../../../controllers/Frontoffice/Product/ProductController");


const router = require("express").Router();

router.route("/get-eight-product-by-categories/:categoryId").get(getProductByCategories);
router.route("/get-product-popular").get(getProductByPopular);
router.route("/get-product-featured").get(getProductByFeatured);
router.route("/get-product-latest").get(getProductByLatest);
router.route("/get-product-by-id/:productId").get(getProductById);

module.exports = router;
