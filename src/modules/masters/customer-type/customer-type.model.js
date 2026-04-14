import mongoose from "mongoose";

const CustomerTypeSchema = new mongoose.Schema(
  {
    code: { type: Number, unique: true, sparse: true },
    customerType: {
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

CustomerTypeSchema.index({ customerType: "text" });

const CustomerTypeModel = mongoose.model("CustomerType", CustomerTypeSchema);

export { CustomerTypeModel };
