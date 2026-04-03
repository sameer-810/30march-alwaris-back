const mongoose = require("mongoose");

const TermsConditionCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: false },
);

const TermsConditionCounterModel = mongoose.model(
  "TermsConditionCounter",
  TermsConditionCounterSchema,
);

module.exports = { TermsConditionCounterModel };
