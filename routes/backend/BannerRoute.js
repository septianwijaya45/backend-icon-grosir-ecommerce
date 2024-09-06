
  const { getAllData, getDataById, updateDataById } = require("../../controllers/Backoffice/Banner/BannerEcommerceController");
const { authenticateToken } = require("../../middleware/authMiddleware");
  
  const router = require("express").Router();
  
  router.use(authenticateToken);
  
  router.route("/get-data").get(getAllData);
  router.route("/get-data-by-id/:id").get(getDataById);
  router.route("/get-data-by-id/update/:id").post(updateDataById);
  
  module.exports = router;
  