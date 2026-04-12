import mongoose from "mongoose";

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },
    passwordHash: { type: String, required: true },
    role: {
      type: String,
      enum: ["Admin", "Operator"],
      required: true,
      index: true,
    },
    isActive: { type: Boolean, default: true, index: true },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

UserSchema.index(
  { email: 1, isDeleted: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

const UserModel = mongoose.model("User", UserSchema);

export { UserModel };
