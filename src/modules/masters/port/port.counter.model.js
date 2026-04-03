const mongoose = require("mongoose");

const PortCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: false },
);

const PortCounterModel = mongoose.model("PortCounter", PortCounterSchema);

module.exports = { PortCounterModel };
