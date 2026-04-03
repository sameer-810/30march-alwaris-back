const mongoose = require("mongoose");

const VendorAgentCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: false },
);

const VendorAgentCounterModel = mongoose.model(
  "VendorAgentCounter",
  VendorAgentCounterSchema,
);

module.exports = { VendorAgentCounterModel };
