import mongoose from "mongoose";

const sizeOptions = ["20", "40", "45"];
const typeOptions = [
  "DC",
  "DV",
  "FR",
  "GP",
  "GV",
  "HC",
  "HD",
  "HQ",
  "ISO",
  "OT",
  "RF",
  "SD",
  "SR",
];
const currencyOptions = ["USD", "AED"];
const chargedPerOptions = ["DOCS", "CONT"];

const CostSheetLineItemSchema = new mongoose.Schema(
  {
    chargeDescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TariffDescription",
      required: false,
      index: true,
    },
    chargeDescriptionName: { type: String, trim: true, default: "" },
    chargeDescriptionCode: { type: String, trim: true, default: "" },
    billingParty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
      index: true,
    },
    billingPartyName: { type: String, trim: true, default: "" },
    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "VendorAgent",
      required: false,
      index: true,
    },
    vendorName: { type: String, trim: true, default: "" },
    chargedPer: {
      type: String,
      enum: chargedPerOptions,
      required: true,
      default: "DOCS",
    },
    qty: { type: Number, required: true, default: 1, min: 0 },
    rate: { type: Number, required: true, default: 0, min: 0 },
    currency: {
      type: String,
      enum: currencyOptions,
      required: true,
      default: "USD",
    },
    size: {
      type: String,
      enum: sizeOptions,
      required: true,
      default: "20",
    },
    type: {
      type: String,
      enum: typeOptions,
      required: true,
      default: "GP",
    },
    amount: { type: Number, required: true, default: 0, min: 0 },
    remarks: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const CostSheetSchema = new mongoose.Schema(
  {
    jobNo: { type: Number, required: true, index: true },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: false,
      index: true,
    },
    bookingParty: { type: String, trim: true, default: "" },
    shipper: { type: String, trim: true, default: "" },
    consignee: { type: String, trim: true, default: "" },
    portOfLoading: { type: String, trim: true, default: "" },
    portOfDestination: { type: String, trim: true, default: "" },
    modeOfTransport: { type: String, trim: true, default: "" },
    etd: { type: Date, default: null },
    eta: { type: Date, default: null },
    volume: { type: Number, default: 0, min: 0 },
    grossWeight: { type: Number, default: 0, min: 0 },
    qty: { type: Number, default: 0, min: 0 },
    incomeDetails: { type: [CostSheetLineItemSchema], default: [] },
    expenseDetails: { type: [CostSheetLineItemSchema], default: [] },
    totals: {
      aedIncome: { type: Number, default: 0 },
      aedExpense: { type: Number, default: 0 },
      aedProfit: { type: Number, default: 0 },
      usdIncome: { type: Number, default: 0 },
      usdExpense: { type: Number, default: 0 },
      usdProfit: { type: Number, default: 0 },
    },
    status: {
      type: String,
      enum: ["Draft", "Pending Approval", "Approved", "Rejected"],
      required: true,
      default: "Draft",
      index: true,
    },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

CostSheetSchema.index({
  bookingParty: "text",
  shipper: "text",
  consignee: "text",
  portOfLoading: "text",
  portOfDestination: "text",
});

const CostSheetModel = mongoose.model("CostSheet", CostSheetSchema);

export { CostSheetModel };
