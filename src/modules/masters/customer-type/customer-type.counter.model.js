const mongoose = require("mongoose");

const CustomerTypeCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: false },
);

const CustomerTypeCounterModel = mongoose.model(
  "CustomerTypeCounter",
  CustomerTypeCounterSchema,
);

module.exports = { CustomerTypeCounterModel };
