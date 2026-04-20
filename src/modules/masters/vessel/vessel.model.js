import mongoose from "mongoose";

const VesselSchema = new mongoose.Schema(
  {
    code: { type: Number, unique: true, sparse: true },
    vesselName: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

VesselSchema.index({ vesselName: "text" });

const VesselModel = mongoose.model("Vessel", VesselSchema);

export { VesselModel };
