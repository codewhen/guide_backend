const { map } = require("../app");
const MapItemModel = require("../models/mapItemModel");
const MapModel = require("../models/mapModel");
const { uploadFile, saveJson } = require("../utils/base64");

exports.addMap = async (req, res) => {
  try {
    console.log(req);
    if (!!req.body.geojson) {
      let geojsonsTemp = [];
      for (const e of req.body.geojson) {
        const v = await saveJson(e);
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

    console.log("items");
    console.log(items);

    const map = await MapModel.create(req.body);

    console.log(map);

    if (!!items) {
      items = await Promise.all(
        items.map(async (item) => {
          let image;
          if (item.image) {
            const v = await uploadFile(item.image, "item.filename.jpg");

            console.log("v");
            console.log(v);
            image = v;
          }
          return { ...item, map: map._id, image };
        })
      );
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
      let geojsonsTemp = [];
      for (const e of req.body.geojson) {
        const v = await saveJson(e);
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

    const map = await MapModel.updateOne(
      { _id: req.params.map, org: req.user._id },
      req.body
    );

    if (!!items) {
      items = items.map(async (item) => {
        let image;
        if (item.image) {
          const v = await uploadFile(item.image, item.filename);
          console.log(v);
          image = v;
        }
        return { ...item, map: req.params.map, image };
      });
      await MapItemModel.deleteMany({ map: req.params.map });
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

exports.getMapsOfOrgs = async (req, res) => {
  try {
    const map = await MapModel.find({ org: req.user._id });

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

exports.getMapsNearby = async (req, res) => {
  try {
    const lat = req.body.lat;
    const lon = req.body.lon;
    const map = await MapModel.find();

    const nearby = [...map].filter(
      (map) => getDistanceBetweenPointsNew(lat, lon, map.lat, map.lon) < 10
    );

    res.status(200).json({
      status: "success",
      maps: nearby,
    });
  } catch (err) {
    console.log(err);
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

exports.searchItemsInAMap = async (req, res) => {
  try {
    const items = await MapItemModel.find({ map: req.params.map }).fuzzySearch(
      req.body.query
    );

    res.status(200).json({
      status: "success",
      items: items,
    });
  } catch (err) {
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

exports.getAllItemsInAMap = async (req, res) => {
  try {
    const items = await MapItemModel.find({ map: req.params.map });

    res.status(200).json({
      status: "success",
      items: items,
    });
  } catch (err) {
    console.log(e);
    res.status(400).json({
      status: "fail",
      message: err,
    });
  }
};

const getDistanceBetweenPointsNew = (latFrom, lonFrom, latTo, lonTo) => {
  const theta = lonFrom - lonTo;
  let distance =
    Math.sin(deg2rad(latFrom)) * Math.sin(deg2rad(latTo)) +
    Math.cos(deg2rad(latFrom)) *
      Math.cos(deg2rad(latTo)) *
      Math.cos(deg2rad(theta));

  distance = Math.acos(distance);
  distance = rad2deg(distance);
  distance = distance * 60 * 1.1515;

  distance = distance * 1.609344;

  return Math.round(distance, 2);
};

const deg2rad = (degrees) => {
  var pi = Math.PI;
  return degrees * (pi / 180);
};

const rad2deg = (radians) => {
  var pi = Math.PI;
  return radians * (180 / pi);
};
