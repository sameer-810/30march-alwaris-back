import mongoose from "mongoose";

const CustomerSchema = new mongoose.Schema(
  {
    code: { type: Number, required: true, unique: true },
    customerTypeId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CustomerType",
      required: true,
      index: true,
    },
    mail: { type: String, trim: true, default: "" },
    customerName: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    country: { type: String, required: true, trim: true },
    state: { type: String, required: true, trim: true },
    pincode: { type: String, required: true, trim: true },
    contactPerson: { type: String, required: true, trim: true },
    contactNo: { type: String, required: true, trim: true },
    emailId: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },
    additionalEmailIds: [{ type: String, trim: true, lowercase: true }],
    gstVatNo: { type: String, trim: true, default: "" },
    creditDays: { type: Number, default: 0, min: 0 },
    stateCode: { type: String, trim: true, default: "" },
    panNo: { type: String, trim: true, default: "" },

    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

CustomerSchema.index({
  customerName: "text",
  emailId: "text",
  city: "text",
  state: "text",
  contactPerson: "text",
  contactNo: "text",
});

const CustomerModel = mongoose.model("Customer", CustomerSchema);

export { CustomerModel };
