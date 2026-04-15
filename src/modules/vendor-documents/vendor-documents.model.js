import mongoose from "mongoose";

const UploadedFileSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, trim: true },
    fileName: { type: String, required: true, trim: true },
    originalName: { type: String, required: true, trim: true },
    mimeType: { type: String, required: true, trim: true },
    size: { type: Number, required: true, min: 0 },
    uploadedAt: { type: Date, required: true, default: Date.now },
  },
  { _id: false },
);

const VendorDocumentRowSchema = new mongoose.Schema(
  {
    rowKey: { type: String, required: true, trim: true },
    rowIndex: { type: Number, required: true, min: 0 },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorAgent",
      required: true,
      index: true,
    },
    chargeDescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TariffDescription",
      required: true,
      index: true,
    },
    amount: { type: Number, required: true, min: 0 },
    file: { type: UploadedFileSchema, required: true },
  },
  { _id: false },
);

const VendorDocumentsSchema = new mongoose.Schema(
  {
    jobNo: { type: Number, required: true, index: true },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    masterBlFile: { type: UploadedFileSchema, default: null },
    vendorRowFiles: { type: [VendorDocumentRowSchema], default: [] },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

VendorDocumentsSchema.index(
  { jobNo: 1, isDeleted: 1 },
  { unique: true, partialFilterExpression: { isDeleted: false } },
);

const VendorDocumentsModel = mongoose.model(
  "VendorDocuments",
  VendorDocumentsSchema,
);

export { VendorDocumentsModel };
