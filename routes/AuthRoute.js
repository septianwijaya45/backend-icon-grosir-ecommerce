const {
    resetPassword,
  } = require("../controllers/Authentication/UserController");
  
const router = require("express").Router();
router.route('/reset-password/:id').put(resetPassword);

module.exports = router;