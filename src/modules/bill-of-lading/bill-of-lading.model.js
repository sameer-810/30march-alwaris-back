const mongoose = require("mongoose");

const containerSizeOptions = ["20", "40", "45"];
const containerTypeOptions = [
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
const commodityOptions = ["General", "Hazardous", "ODC"];

const BillOfLadingContainerSchema = new mongoose.Schema(
  {
    containerNo: { type: String, required: true, trim: true },
    size: {
      type: String,
      enum: containerSizeOptions,
      required: true,
      default: "20",
    },
    type: {
      type: String,
      enum: containerTypeOptions,
      required: true,
      default: "GP",
    },
    agentSeal: { type: String, trim: true, default: "" },
    customSeal: { type: String, trim: true, default: "" },
    piece: { type: Number, min: 0, default: 0 },
    countPackage: { type: String, trim: true, default: "" },
    commodity: {
      type: String,
      enum: commodityOptions,
      required: true,
      default: "General",
    },
    netWeight: { type: Number, min: 0, default: 0 },
    grossWeight: { type: Number, min: 0, default: 0 },
    shippingBill: { type: String, trim: true, default: "" },
    cbm: { type: Number, min: 0, default: 0 },
    hbl: { type: String, trim: true, default: "" },
  },
  { _id: false },
);

const BillOfLadingConsignmentDetailsSchema = new mongoose.Schema(
  {
    shipper: { type: String, trim: true, default: "" },
    consignee: { type: String, trim: true, default: "" },
    notifyParty: { type: String, trim: true, default: "" },
    marksAndNos: { type: String, trim: true, default: "" },
    descriptionOfGoods: { type: String, trim: true, default: "" },
    deliveryAgent: { type: String, trim: true, default: "" },
    placeOfAcceptance: { type: String, trim: true, default: "" },
    portOfLoading: { type: String, trim: true, default: "" },
    placeOfDischarge: { type: String, trim: true, default: "" },
    portOfDelivery: { type: String, trim: true, default: "" },
    consigneeEmail: { type: String, trim: true, default: "" },
    notifyEmail: { type: String, trim: true, default: "" },
    routePlaceOfTranshipment: { type: String, trim: true, default: "" },
    package: { type: String, trim: true, default: "" },
    measurement: { type: String, trim: true, default: "" },
    freeDaysAgreed: { type: String, trim: true, default: "" },
    vesselVoyage: { type: String, trim: true, default: "" },
    modeMeansOf: { type: String, trim: true, default: "" },
    freightPayable: { type: String, trim: true, default: "" },
    freightAmount: { type: Number, min: 0, default: 0 },
    place: { type: String, trim: true, default: "" },
    date: { type: Date, default: null },
    dateOfIssue: { type: Date, default: null },
  },
  { _id: false },
);

const BillOfLadingSchema = new mongoose.Schema(
  {
    hblNo: { type: Number, required: true, unique: true, index: true },
    jobNo: { type: Number, required: true, index: true },
    referenceNo: { type: String, required: true, trim: true, index: true },
    status: {
      type: String,
      enum: ["Draft", "RFS", "SOB"],
      required: true,
      default: "Draft",
      index: true,
    },
    blNumber: { type: String, required: true, trim: true, index: true },
    consignmentDetails: {
      type: BillOfLadingConsignmentDetailsSchema,
      default: () => ({}),
    },
    containerDetails: {
      type: [BillOfLadingContainerSchema],
      default: [],
    },
    isDeleted: { type: Boolean, default: false, index: true },
    deletedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

BillOfLadingSchema.index(
  {
    referenceNo: "text",
    blNumber: "text",
    "consignmentDetails.shipper": "text",
    "consignmentDetails.consignee": "text",
    "containerDetails.containerNo": "text",
    "containerDetails.shippingBill": "text",
    "containerDetails.hbl": "text",
  },
  {
    weights: {
      blNumber: 5,
      referenceNo: 4,
      "containerDetails.hbl": 3,
    },
  },
);

const BillOfLadingModel = mongoose.model("BillOfLading", BillOfLadingSchema);

module.exports = {
  BillOfLadingModel,
};
