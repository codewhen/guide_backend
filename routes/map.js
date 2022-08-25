const express = require("express");
const router = express.Router();
const mapcontroller = require("../controller/map_controller");
const passport = require("passport");

/* GET users listing. */
router.get("/", function (req, res) {
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

router.route("/searchInsideMap/:map").post(mapcontroller.searchItemsInAMap);

router.route("/nearby").post(mapcontroller.getMapsNearby);

module.exports = router;
