const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const Schema = mongoose.Schema;

const MapSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  placeName: {
    type: String,
    required: true,
  },
  geojson: [
    {
      type: String,
      required: true,
    },
  ],
  items: {
    type: [
      {
        name: { type: String, required: true },
        lat: { type: Number, required: true },
        lon: { type: Number, required: true },
      },
    ],
    required: true,
  },
  lat: {
    type: Number,
    required: true,
  },
  lon: {
    type: Number,
    required: true,
  },
  thumbnailUrl: {
    type: String,
    required: true,
  },
  org: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "org",
  },
});

MapSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["name", "placeName"],
});

const MapModel = mongoose.model("map", MapSchema);

module.exports = MapModel;
