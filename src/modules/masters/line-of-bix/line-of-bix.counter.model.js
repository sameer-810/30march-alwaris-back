const mongoose = require("mongoose");

const LineOfBixCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: false },
);

const LineOfBixCounterModel = mongoose.model(
  "LineOfBixCounter",
  LineOfBixCounterSchema,
);

module.exports = { LineOfBixCounterModel };
