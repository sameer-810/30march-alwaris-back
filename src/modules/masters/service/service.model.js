const mongoose = require("mongoose");

const ServiceSchema = new mongoose.Schema(
  {
    code: { type: Number, unique: true, index: true, sparse: true },
    serviceType: {
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

ServiceSchema.index({ serviceType: "text" });

const ServiceModel = mongoose.model("Service", ServiceSchema);

module.exports = { ServiceModel };
