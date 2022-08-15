const MapModel = require("../models/mapModel");
const Util = require("../utils/base64");

exports.addMap = async (req, res) => {
  try {
    console.log(req.params);
    if (!!req.body.geojson) {
      let geojsonsTemp = [];
      for (const e of req.body.geojson) {
        console.log(e);
        const v = await Util.saveJson(e);
        console.log(v);
        geojsonsTemp.push(v);
      }
      req.body.geojson = geojsonsTemp;
      req.body.org = req.params.id;
    }

    console.log(req.body);

    const map = await MapModel.create(req.body);

    res.status(201).json({
      status: "success",
      maps: map,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.updateMap = async (req, res) => {
  try {
    if (!!req.body.geojson) {
      var geojsonsTemp = [];
      for (var e in req.body.geojson) {
        const v = await Util.saveJson(e);
        console.log(v);
        geojsonsTemp.push(v);
      }
      req.body.geojson = geojsonsTemp;
      req.body.org = req.params.id;
    }

    console.log(req.body);

    const map = await MapModel.updateOne(
      { _id: req.params.map, org: req.params.id },
      req.body
    );

    res.status(201).json({
      status: "success",
      maps: map,
    });
  } catch (err) {
    console.log(err);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getMapsOfOrgs = async (req, res) => {
  try {
    const map = await MapModel.find({ org: req.params.id });

    res.status(200).json({
      status: "success",
      maps: map,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.searchMaps = async (req, res) => {
  try {
    const map = await MapModel.fuzzySearch(req.body.query);

    res.status(200).json({
      status: "success",
      maps: map,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};
