const mongoose = require("mongoose");

const VendorTypeSchema = new mongoose.Schema(
  {
    code: { type: Number, unique: true, index: true, sparse: true },
    vendorType: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

VendorTypeSchema.index({ vendorType: "text" });

const VendorTypeModel = mongoose.model("VendorType", VendorTypeSchema);

module.exports = { VendorTypeModel };
