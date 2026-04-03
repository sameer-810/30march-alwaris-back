const mongoose = require("mongoose");

const TermsCounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { versionKey: false, timestamps: false },
);

const TermsCounterModel = mongoose.model("TermsCounter", TermsCounterSchema);

module.exports = { TermsCounterModel };
