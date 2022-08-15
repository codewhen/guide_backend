var express = require("express");
var router = express.Router();
const mapcontroller = require("../controller/map_controller");
const passport = require("passport");

/* GET users listing. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "GUIDE API: map" });
});

router
  .route("/new")
  .post(passport.authenticate("jwt", { session: false }), mapcontroller.addMap);

router
  .route("/org/all")
  .get(
    passport.authenticate("jwt", { session: false }),
    mapcontroller.getMapsOfOrgs
  );

router
  .route("/org/:map")
  .put(
    passport.authenticate("jwt", { session: false }),
    mapcontroller.updateMap
  );

router.route("/search").post(mapcontroller.searchMaps);

module.exports = router;
