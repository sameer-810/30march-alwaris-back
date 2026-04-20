import mongoose from "mongoose";

const LineOfBixSchema = new mongoose.Schema(
  {
    counter: { type: Number, unique: true, sparse: true },
    code: {
      type: String,
      required: true,
      trim: true,
      unique: true,
    },
    lineOfBix: {
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

LineOfBixSchema.index({ code: "text", lineOfBix: "text" });

const LineOfBixModel = mongoose.model("LineOfBix", LineOfBixSchema);

export { LineOfBixModel };
