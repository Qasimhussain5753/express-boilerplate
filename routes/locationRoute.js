const router = require("express").Router();

const { locationName } = require("../controller/locationController");
router.route("/latlng").post(locationName);
module.exports = router;
