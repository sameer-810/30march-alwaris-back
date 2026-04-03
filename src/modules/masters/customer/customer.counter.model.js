const mongoose = require("mongoose");

const CustomerCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: false },
);

const CustomerCounterModel = mongoose.model(
  "CustomerCounter",
  CustomerCounterSchema,
);

module.exports = { CustomerCounterModel };
