import mongoose from "mongoose";

const INVOICE_TYPE_OPTIONS = ["Proforma", "Tax Invoice"];
const CURRENCY_OPTIONS = ["AED", "USD"];
const PAYMENT_TYPE_OPTIONS = ["CHEQUE", "CASH", "BANK TRANSFER"];

const InvoiceLineItemSchema = new mongoose.Schema(
  {
    lineNo: { type: Number, default: 0 },
    jobNo: { type: Number, required: true, min: 1 },
    invoiceNo: { type: String, trim: true, default: "" },
    jobDate: { type: Date, default: null },
    code: { type: String, trim: true, default: "" },
    description: { type: String, trim: true, default: "" },
    chargedPer: { type: String, trim: true, default: "DOCS" },
    currency: {
      type: String,
      enum: CURRENCY_OPTIONS,
      default: "AED",
    },
    size: { type: String, trim: true, default: "20" },
    type: { type: String, trim: true, default: "GP" },
    qty: { type: Number, min: 0, default: 0 },
    rate: { type: Number, min: 0, default: 0 },
    amount: { type: Number, min: 0, default: 0 },
    serviceCode: { type: String, trim: true, default: "" },
    gstVat: { type: Number, min: 0, default: 0 },
    gstVatAmount: { type: Number, min: 0, default: 0 },
    cgst: { type: Number, min: 0, default: 0 },
    cgstAmount: { type: Number, min: 0, default: 0 },
    sgst: { type: Number, min: 0, default: 0 },
    sgstAmount: { type: Number, min: 0, default: 0 },
    igst: { type: Number, min: 0, default: 0 },
    igstAmount: { type: Number, min: 0, default: 0 },
    wht: { type: Number, min: 0, default: 0 },
    whtAmount: { type: Number, min: 0, default: 0 },
    totalAmount: { type: Number, default: 0 },
    remark: { type: String, trim: true, default: "" },
    exRate: { type: Number, min: 0, default: 1 },
  },
  { _id: true },
);

const InvoicePaymentSchema = new mongoose.Schema(
  {
    vocNo: { type: String, trim: true, default: "" },
    vocDate: { type: Date, default: null },
    invoice: { type: String, trim: true, default: "" },
    payAmount: { type: Number, min: 0, default: 0 },
    tdsAmount: { type: Number, min: 0, default: 0 },
    clientBank: { type: String, trim: true, default: "" },
    bankBranch: { type: String, trim: true, default: "" },
    clientAcNo: { type: String, trim: true, default: "" },
    payType: {
      type: String,
      enum: PAYMENT_TYPE_OPTIONS,
      default: "BANK TRANSFER",
    },
    chequeNo: { type: String, trim: true, default: "" },
    ourBank: { type: String, trim: true, default: "" },
    tokenNo: { type: String, trim: true, default: "" },
    paymentDate: { type: Date, default: null },
  },
  { _id: true },
);

const InvoiceSchema = new mongoose.Schema(
  {
    jobNo: { type: Number, required: true, index: true },
    invoiceType: {
      type: String,
      enum: INVOICE_TYPE_OPTIONS,
      required: true,
      index: true,
    },
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: false,
      index: true,
    },
    costSheetId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "CostSheet",
      required: false,
      index: true,
    },
    invoiceNo: { type: String, trim: true, default: "" },
    invoiceDate: { type: Date, default: null },
    customerName: { type: String, trim: true, default: "" },
    jobDate: { type: Date, default: null },
    branch: { type: String, trim: true, default: "" },
    amount: { type: Number, min: 0, default: 0 },
    tax: { type: Number, min: 0, default: 0 },
    totalAmount: { type: Number, min: 0, default: 0 },
    payAmount: { type: Number, min: 0, default: 0 },
    tdsAmount: { type: Number, min: 0, default: 0 },
    balanceAmount: { type: Number, default: 0 },
    voyage: { type: String, trim: true, default: "" },
    vesselName: { type: String, trim: true, default: "" },
    pol: { type: String, trim: true, default: "" },
    fpod: { type: String, trim: true, default: "" },
    cgst: { type: Number, min: 0, default: 0 },
    sgst: { type: Number, min: 0, default: 0 },
    igst: { type: Number, min: 0, default: 0 },
    exRate: { type: Number, min: 0, default: 1 },
    actualJob: { type: Number, min: 0, default: 0 },
    actualInvoice: { type: Number, min: 0, default: 0 },
    credit: { type: Number, min: 0, default: 0 },
    creditDate: { type: Date, default: null },
    remarks: { type: String, trim: true, default: "" },
    createdBy: { type: String, trim: true, default: "" },
    checker: { type: String, trim: true, default: "" },
    checkedBy: { type: String, trim: true, default: "" },
    creditDays: { type: Number, min: 0, default: 0 },
    wht: { type: Number, min: 0, default: 0 },
    actualTotal: { type: Number, min: 0, default: 0 },
    payableAt: {
      type: String,
      enum: CURRENCY_OPTIONS,
      default: "AED",
    },
    bankName: { type: String, trim: true, default: "" },
    partyName: { type: String, trim: true, default: "" },
    lineItems: { type: [InvoiceLineItemSchema], default: [] },
    payments: { type: [InvoicePaymentSchema], default: [] },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

InvoiceSchema.index({
  invoiceNo: "text",
  customerName: "text",
  remarks: "text",
});

const InvoiceModel = mongoose.model("Invoice", InvoiceSchema);

export {
  InvoiceModel,
  INVOICE_TYPE_OPTIONS,
  CURRENCY_OPTIONS,
  PAYMENT_TYPE_OPTIONS,
};
