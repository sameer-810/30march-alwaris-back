const mongoose = require("mongoose");

const TermsSchema = new mongoose.Schema(
  {
    code: { type: Number, unique: true, index: true, sparse: true },
    terms: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    description: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

TermsSchema.index({ terms: "text", description: "text" });

const TermsModel = mongoose.model("Terms", TermsSchema);

module.exports = { TermsModel };
