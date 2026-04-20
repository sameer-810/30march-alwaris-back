import { toNumber, toString } from "../common/shared-crud/dtoMappers.js";

function toLineItemDto(row = {}) {
  return {
    id: row?._id ? String(row._id) : toString(row?.id),
    lineNo: toNumber(row?.lineNo, 0),
    jobNo: toNumber(row?.jobNo, 0),
    invoiceNo: toString(row?.invoiceNo),
    jobDate: row?.jobDate || "",
    code: toString(row?.code),
    description: toString(row?.description),
    chargedPer: toString(row?.chargedPer || "DOCS"),
    currency: toString(row?.currency || "AED"),
    size: toString(row?.size || "20"),
    type: toString(row?.type || "GP"),
    qty: toNumber(row?.qty, 0),
    rate: toNumber(row?.rate, 0),
    amount: toNumber(row?.amount, 0),
    serviceCode: toString(row?.serviceCode),
    gstVat: toNumber(row?.gstVat, 0),
    gstVatAmount: toNumber(row?.gstVatAmount, 0),
    cgst: toNumber(row?.cgst, 0),
    cgstAmount: toNumber(row?.cgstAmount, 0),
    sgst: toNumber(row?.sgst, 0),
    sgstAmount: toNumber(row?.sgstAmount, 0),
    igst: toNumber(row?.igst, 0),
    igstAmount: toNumber(row?.igstAmount, 0),
    wht: toNumber(row?.wht, 0),
    whtAmount: toNumber(row?.whtAmount, 0),
    totalAmount: toNumber(row?.totalAmount, 0),
    remark: toString(row?.remark),
    exRate: toNumber(row?.exRate, 1),
  };
}

function toPaymentDto(row = {}) {
  return {
    id: row?._id ? String(row._id) : toString(row?.id),
    vocNo: toString(row?.vocNo),
    vocDate: row?.vocDate || "",
    invoice: toString(row?.invoice),
    payAmount: toNumber(row?.payAmount, 0),
    tdsAmount: toNumber(row?.tdsAmount, 0),
    clientBank: toString(row?.clientBank),
    bankBranch: toString(row?.bankBranch),
    clientAcNo: toString(row?.clientAcNo),
    payType: toString(row?.payType || "BANK TRANSFER"),
    chequeNo: toString(row?.chequeNo),
    ourBank: toString(row?.ourBank),
    tokenNo: toString(row?.tokenNo),
    paymentDate: row?.paymentDate || "",
  };
}

function toInvoiceDto(doc) {
  if (!doc) return null;

  return {
    id: String(doc._id),
    jobNo: toNumber(doc.jobNo, 0),
    invoiceType: toString(doc.invoiceType),
    bookingId: doc.bookingId ? String(doc.bookingId) : "",
    costSheetId: doc.costSheetId ? String(doc.costSheetId) : "",
    invoiceNo: toString(doc.invoiceNo),
    invoiceDate: doc.invoiceDate || "",
    customerName: toString(doc.customerName),
    jobDate: doc.jobDate || "",
    branch: toString(doc.branch),
    amount: toNumber(doc.amount, 0),
    tax: toNumber(doc.tax, 0),
    totalAmount: toNumber(doc.totalAmount, 0),
    payAmount: toNumber(doc.payAmount, 0),
    tdsAmount: toNumber(doc.tdsAmount, 0),
    balanceAmount: toNumber(doc.balanceAmount, 0),
    voyage: toString(doc.voyage),
    vesselName: toString(doc.vesselName),
    pol: toString(doc.pol),
    fpod: toString(doc.fpod),
    cgst: toNumber(doc.cgst, 0),
    sgst: toNumber(doc.sgst, 0),
    igst: toNumber(doc.igst, 0),
    exRate: toNumber(doc.exRate, 1),
    actualJob: toNumber(doc.actualJob, 0),
    actualInvoice: toNumber(doc.actualInvoice, 0),
    credit: toNumber(doc.credit, 0),
    creditDate: doc.creditDate || "",
    remarks: toString(doc.remarks),
    createdBy: toString(doc.createdBy),
    checker: toString(doc.checker),
    checkedBy: toString(doc.checkedBy),
    creditDays: toNumber(doc.creditDays, 0),
    wht: toNumber(doc.wht, 0),
    actualTotal: toNumber(doc.actualTotal, 0),
    payableAt: toString(doc.payableAt || "AED"),
    bankName: toString(doc.bankName),
    partyName: toString(doc.partyName),
    lineItems: Array.isArray(doc.lineItems)
      ? doc.lineItems.map((row) => toLineItemDto(row))
      : [],
    payments: Array.isArray(doc.payments)
      ? doc.payments.map((row) => toPaymentDto(row))
      : [],
    createdAt: doc.createdAt,
    updatedAt: doc.updatedAt,
  };
}

export { toInvoiceDto };
