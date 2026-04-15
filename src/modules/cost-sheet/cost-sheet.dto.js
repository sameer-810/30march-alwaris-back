import { toNumber, toRef, toString } from "../common/shared-crud/dtoMappers.js";

function toLineItemDto(row = {}) {
  const chargeDescriptionRef = toRef(row?.chargeDescription, ["description"]);
  const billingPartyRef = toRef(row?.billingParty, [
    "customerName",
    "vendorName",
    "employeeName",
  ]);
  const vendorRef = toRef(row?.vendor, ["vendorName"]);

  return {
    chargeDescriptionId: chargeDescriptionRef.id,
    chargeDescriptionName:
      toString(row?.chargeDescriptionName) || chargeDescriptionRef.label,
    chargeDescriptionCode: toString(row?.chargeDescriptionCode),
    billingPartyId: billingPartyRef.id,
    billingPartyName: toString(row?.billingPartyName) || billingPartyRef.label,
    vendorId: vendorRef.id,
    vendorName: toString(row?.vendorName) || vendorRef.label,
    chargedPer: row?.chargedPer || "DOCS",
    qty: toNumber(row?.qty, 0),
    size: toString(row?.size || "20"),
    type: toString(row?.type || "GP"),
    currency: toString(row?.currency || "USD"),
    rate: toNumber(row?.rate, 0),
    amount: toNumber(row?.amount, 0),
    remarks: toString(row?.remarks),
  };
}

function toCostSheetDto(doc) {
  if (!doc) return null;

  return {
    id: String(doc._id),
    jobNo: toNumber(doc.jobNo, 0),
    bookingId: doc.bookingId ? String(doc.bookingId) : "",
    bookingParty: toString(doc.bookingParty),
    shipper: toString(doc.shipper),
    consignee: toString(doc.consignee),
    portOfLoading: toString(doc.portOfLoading),
    portOfDestination: toString(doc.portOfDestination),
    modeOfTransport: toString(doc.modeOfTransport),
    etd: doc.etd || "",
    eta: doc.eta || "",
    volume: toNumber(doc.volume, 0),
    grossWeight: toNumber(doc.grossWeight, 0),
    qty: toNumber(doc.qty, 0),
    incomeDetails: Array.isArray(doc.incomeDetails)
      ? doc.incomeDetails.map((row) => toLineItemDto(row))
      : [],
    expenseDetails: Array.isArray(doc.expenseDetails)
      ? doc.expenseDetails.map((row) => toLineItemDto(row))
      : [],
    totals: {
      aedIncome: toNumber(doc?.totals?.aedIncome, 0),
      aedExpense: toNumber(doc?.totals?.aedExpense, 0),
      aedProfit: toNumber(doc?.totals?.aedProfit, 0),
      usdIncome: toNumber(doc?.totals?.usdIncome, 0),
      usdExpense: toNumber(doc?.totals?.usdExpense, 0),
      usdProfit: toNumber(doc?.totals?.usdProfit, 0),
    },
    status: toString(doc.status || "Draft"),
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export { toCostSheetDto };
