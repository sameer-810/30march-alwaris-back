import mongoose from "mongoose";

const CounterSchema = new mongoose.Schema(
  {
    _id: { type: String, required: true },
    seq: { type: Number, default: 0 },
  },
  { timestamps: false },
);

const CounterModel =
  mongoose.models.Counter || mongoose.model("Counter", CounterSchema);

export { CounterModel };
