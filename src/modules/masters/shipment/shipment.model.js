import mongoose from "mongoose";

const ShipmentSchema = new mongoose.Schema(
  {
    code: { type: Number, unique: true, sparse: true },
    shipmentType: {
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

ShipmentSchema.index({ shipmentType: "text" });

const ShipmentModel = mongoose.model("Shipment", ShipmentSchema);

export { ShipmentModel };
