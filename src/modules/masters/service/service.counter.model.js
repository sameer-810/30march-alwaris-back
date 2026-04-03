const mongoose = require("mongoose");

const ServiceCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: false },
);

const ServiceCounterModel = mongoose.model(
  "ServiceCounter",
  ServiceCounterSchema,
);

module.exports = { ServiceCounterModel };
