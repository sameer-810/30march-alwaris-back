const mongoose = require("mongoose");

const PortSchema = new mongoose.Schema(
  {
    code: { type: Number, unique: true, index: true, sparse: true },
    portCode: {
      type: String,
      required: true,
      trim: true,
      unique: true,
      index: true,
    },
    portName: {
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

PortSchema.index({ portCode: "text", portName: "text" });

const PortModel = mongoose.model("Port", PortSchema);

module.exports = { PortModel };
