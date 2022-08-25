const mongoose = require("mongoose");
const mongoose_fuzzy_searching = require("mongoose-fuzzy-searching");

const Schema = mongoose.Schema;

const MapItemSchema = new Schema({
  name: { type: String, required: true },
  lat: { type: Number, required: true },
  lon: { type: Number, required: true },
  desc: { type: String, required: true },
  map: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "map",
    required: true,
  },
});

MapItemSchema.plugin(mongoose_fuzzy_searching, {
  fields: ["name"],
});

const MapItemModel = mongoose.model("mapItem", MapItemSchema);

module.exports = MapItemModel;
