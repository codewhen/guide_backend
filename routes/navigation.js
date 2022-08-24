var express = require("express");
var router = express.Router();
const navcontroller = require("../controller/navigation_controller");

router.post("/getRoute", navcontroller.getRoute);

module.exports = router;
