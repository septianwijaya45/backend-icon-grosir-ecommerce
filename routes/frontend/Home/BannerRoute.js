const { getAllData } = require("../../../controllers/Frontoffice/Banner/BannerEcommerceController");

  
const router = require("express").Router();
    
router.route("/get-data").get(getAllData);
  
module.exports = router;
  