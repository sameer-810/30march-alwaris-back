import mongoose from "mongoose";

const BOOKING_CONTAINER_SIZE_ENUM = ["20", "40", "45"];
const BOOKING_CONTAINER_TYPE_ENUM = [
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
const BOOKING_CURRENCY_ENUM = ["USD", "AED"];

const BookingShipmentDetailSchema = new mongoose.Schema(
  {
    generatedReference: { type: String, required: true, trim: true },
    containerNo: { type: String, trim: true, default: "" },
    qty: { type: Number, required: true, default: 1, min: 1 },
    size: {
      type: String,
      enum: BOOKING_CONTAINER_SIZE_ENUM,
      required: true,
      default: "20",
    },
    type: {
      type: String,
      enum: BOOKING_CONTAINER_TYPE_ENUM,
      required: true,
      default: "GP",
    },
    commodity: { type: String, trim: true, default: "" },
    netWeight: { type: Number, default: 0, min: 0 },
    grossWeight: { type: Number, default: 0, min: 0 },
    volume: { type: Number, default: 0, min: 0 },
    vessel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Vessel",
      index: true,
    },
    voyage: { type: String, trim: true, default: "" },
    etd: { type: Date, required: true },
    eta: { type: Date, required: true },
    hbl: { type: String, trim: true, default: "" },
    remarks: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const BookingIncomeDetailSchema = new mongoose.Schema(
  {
    incomeBillingParty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
      index: true,
    },
    chargeDescription: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TariffDescription",
      required: true,
      index: true,
    },
    chargedPer: {
      type: String,
      enum: ["DOCS", "CONT"],
      required: true,
      default: "DOCS",
    },
    qty: { type: Number, required: true, default: 1, min: 1 },
    rate: { type: Number, required: true, default: 0, min: 0 },
    currency: {
      type: String,
      enum: BOOKING_CURRENCY_ENUM,
      required: true,
      default: "USD",
    },
    size: {
      type: String,
      enum: BOOKING_CONTAINER_SIZE_ENUM,
      required: true,
      default: "20",
    },
    type: {
      type: String,
      enum: BOOKING_CONTAINER_TYPE_ENUM,
      required: true,
      default: "GP",
    },
    amount: { type: Number, required: true, default: 0, min: 0 },
    exRate: { type: Number, required: true, default: 1, min: 0 },
    remarks: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const BookingExpenseDetailSchema = new mongoose.Schema(
  {
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
    chargedPer: {
      type: String,
      enum: ["DOCS", "CONT"],
      required: true,
      default: "DOCS",
    },
    qty: { type: Number, required: true, default: 1, min: 1 },
    rate: { type: Number, required: true, default: 0, min: 0 },
    currency: {
      type: String,
      enum: BOOKING_CURRENCY_ENUM,
      required: true,
      default: "USD",
    },
    size: {
      type: String,
      enum: BOOKING_CONTAINER_SIZE_ENUM,
      required: true,
      default: "20",
    },
    type: {
      type: String,
      enum: BOOKING_CONTAINER_TYPE_ENUM,
      required: true,
      default: "GP",
    },
    amount: { type: Number, required: true, default: 0, min: 0 },
    exRate: { type: Number, required: true, default: 1, min: 0 },
    invoiceNo: { type: String, trim: true, default: "" },
    date: { type: Date, required: true },
    remarks: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const BookingSchema = new mongoose.Schema(
  {
    jobNo: { type: Number, required: true, unique: true },
    jobDate: { type: Date, required: true, index: true },
    rateAgreedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: false,
      index: true,
    },
    bookingParty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
      index: true,
    },
    kindAttention: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Employee",
      required: false,
      index: true,
    },
    shipper: { type: String, trim: true, default: "" },
    consignee: { type: String, trim: true, default: "" },
    modeOfTransport: {
      type: String,
      enum: ["Air", "Sea", "Road"],
      required: true,
      default: "Sea",
    },
    exportImport: {
      type: String,
      enum: ["Export", "Import", "Cross Trade"],
      required: true,
      default: "Export",
    },
    portOfLoading: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Port",
      required: false,
      index: true,
    },
    portOfDestination: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Port",
      required: false,
      index: true,
    },
    line: {
      type: String,
      enum: ["ACL", "AGL", "ASR"],
      required: false,
    },
    status: {
      type: String,
      enum: ["Pending", "Done", "Cancel"],
      required: true,
      default: "Pending",
    },
    terms: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Terms",
      required: false,
      index: true,
    },
    lineOfBix: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "LineOfBix",
      required: false,
      index: true,
    },
    mbl: { type: String, trim: true, default: "" },
    orderReference: { type: String, trim: true, default: "" },
    defaultCurrency: {
      type: String,
      enum: BOOKING_CURRENCY_ENUM,
      default: "USD",
    },
    billingParty: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: false,
      index: true,
    },
    shipmentDetails: { type: [BookingShipmentDetailSchema], default: [] },
    incomeDetails: { type: [BookingIncomeDetailSchema], default: [] },
    incomeTotalInAed: { type: Number, default: 0, min: 0 },
    expenseDetails: { type: [BookingExpenseDetailSchema], default: [] },
    expenseTotalInAed: { type: Number, default: 0, min: 0 },
    netAmountInAed: { type: Number, default: 0 },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

BookingSchema.index({
  shipper: "text",
  consignee: "text",
  mbl: "text",
  orderReference: "text",
  "shipmentDetails.hbl": "text",
  "shipmentDetails.containerNo": "text",
  "shipmentDetails.generatedReference": "text",
});

const BookingModel = mongoose.model("Booking", BookingSchema);

export { BookingModel };
