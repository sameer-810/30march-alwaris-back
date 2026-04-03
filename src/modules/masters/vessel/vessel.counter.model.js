const mongoose = require("mongoose");

const VesselCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: false },
);

const VesselCounterModel = mongoose.model("VesselCounter", VesselCounterSchema);

module.exports = { VesselCounterModel };
