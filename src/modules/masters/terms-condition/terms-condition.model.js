import mongoose from "mongoose";

const TermsConditionSchema = new mongoose.Schema(
  {
    counter: { type: Number, unique: true, sparse: true },
    lineOfBixId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LineOfBix",
      required: true,
      index: true,
    },
    description: { type: String, required: true, trim: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

TermsConditionSchema.index({ description: "text" });

const TermsConditionModel = mongoose.model(
  "TermsCondition",
  TermsConditionSchema,
);

export { TermsConditionModel };
