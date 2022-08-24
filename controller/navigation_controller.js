const turf = require("@turf/turf");

exports.getRoute = async (req, res) => {
  try {
    const start = req.body.start;
    const end = req.body.end;
    const obstacles = req.body.obstacles;
    console.log(start);
    console.log(end);
    console.log(obstacles);

    var options = {
      obstacles: turf.featureCollection(obstacles),
    };

    var path = turf.shortestPath(start, end, options);

    res.status(200).json({
      status: "success",
      path: path,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
