const { getProductByCategories, getProductByFeatured, getProductByLatest, getProductByPopular, getProductById, getAllProduct, getVarianById, getWarnaById, getUkuranById, getHargaById, getTopViewProduct } = require("../../../controllers/Frontoffice/Product/ProductController");

const router = require("express").Router();

router.route('/get-all-product').get(getAllProduct)
router.route('/get-top-view-product').get(getTopViewProduct)
router.route("/get-eight-product-by-categories/:categoryId").get(getProductByCategories);
router.route("/get-product-popular").get(getProductByPopular);
router.route("/get-product-featured").get(getProductByFeatured);
router.route("/get-product-latest").get(getProductByLatest);
router.route("/get-product-by-id/:productId").get(getProductById);
router.route("/get-varian/:product_id").get(getVarianById);
router.route("/get-warna/:product_id/:variant_id/:wishlish").get(getWarnaById);
router.route("/get-ukuran/:product_id/:variant_id/:warna/:wishlish").get(getUkuranById);
router.route("/get-harga/:product_id/:variant_id/:warna/:ukuran/:wishlish").get(getHargaById);


module.exports = router;
