const mongoose = require("mongoose");

const TariffDescriptionCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: false },
);

const TariffDescriptionCounterModel = mongoose.model(
  "TariffDescriptionCounter",
  TariffDescriptionCounterSchema,
);

module.exports = { TariffDescriptionCounterModel };
