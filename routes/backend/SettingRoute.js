const { getSetting, insertOrUpdate } = require("../../controllers/Backoffice/Setting/SettingController");

const router = require("express").Router();

router.route('/get-setting').get(getSetting);
router.route('/update-setting').post(insertOrUpdate);

module.exports = router;