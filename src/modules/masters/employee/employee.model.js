import mongoose from "mongoose";

const EmployeeSchema = new mongoose.Schema(
  {
    employeeId: { type: String, required: true, unique: true }, // e.g. EMP000001
    isActive: { type: Boolean, default: true, index: true },
    isApproved: { type: Boolean, default: false, index: true },

    employeeName: { type: String, required: true, trim: true, index: true },
    department: {
      type: String,
      enum: ["HOD", "Marketing", "Accounts", "Other"],
      required: true,
      index: true,
    },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true, index: true },
    pincode: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true, index: true },
    country: { type: String, required: true, trim: true, index: true },
    contactNo: { type: String, required: true, trim: true },
    emailId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
      index: true,
    },

    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

EmployeeSchema.index({
  employeeName: "text",
  employeeId: "text",
  emailId: "text",
  city: "text",
  state: "text",
});

const EmployeeModel = mongoose.model("Employee", EmployeeSchema);

export { EmployeeModel };
