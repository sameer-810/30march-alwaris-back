import mongoose from "mongoose";

const TariffDescriptionSchema = new mongoose.Schema(
  {
    counter: { type: Number, unique: true, sparse: true },
    description: {
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

TariffDescriptionSchema.index({ description: "text" });

const TariffDescriptionModel = mongoose.model(
  "TariffDescription",
  TariffDescriptionSchema,
);

export { TariffDescriptionModel };
