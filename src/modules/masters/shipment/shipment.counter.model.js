const mongoose = require("mongoose");

const ShipmentCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: false },
);

const ShipmentCounterModel = mongoose.model(
  "ShipmentCounter",
  ShipmentCounterSchema,
);

module.exports = { ShipmentCounterModel };
