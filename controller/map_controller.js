const { map } = require("../app");
const MapItemModel = require("../models/mapItemModel");
const MapModel = require("../models/mapModel");
const Util = require("../utils/base64");

exports.addMap = async (req, res) => {
  try {
    if (!!req.body.geojson) {
      let geojsonsTemp = [];
      for (const e of req.body.geojson) {
        const v = await Util.saveJson(e);
        geojsonsTemp.push(v);
      }
      req.body.geojson = geojsonsTemp;
      req.body.org = req.user._id;
    }
    let items;
    if (!!req.body.items) {
      items = req.body.items;
      req.body.items = null;
    }

    console.log(req.body);

    const map = await MapModel.create(req.body);

    console.log(map);

    if (!!items) {
      items = items.map((item) => {
        return { ...item, map: map._id };
      });
      await MapItemModel.insertMany(items);
    }

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
