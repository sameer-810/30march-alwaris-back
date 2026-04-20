import { createResourceService } from "../common/shared-crud/createResourceService.js";
import { AppError } from "../../utils/AppError.js";
import { invoiceRepository } from "./invoice.repository.js";

function toNumber(value, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function round2(value) {
  return Number(toNumber(value, 0).toFixed(2));
}

function normalizeLineItem(row = {}, index = 0, defaultJobNo = 0) {
  const qty = toNumber(row.qty, 0);
  const rate = toNumber(row.rate, 0);
  const exRate = toNumber(row.exRate, 1);
  const amount = round2(row.amount ?? qty * rate * exRate);

  const gstVat = toNumber(row.gstVat, 0);
  const cgst = toNumber(row.cgst, 0);
  const sgst = toNumber(row.sgst, 0);
  const igst = toNumber(row.igst, 0);
  const wht = toNumber(row.wht, 0);

  const gstVatAmount = round2(row.gstVatAmount ?? (amount * gstVat) / 100);
  const cgstAmount = round2(row.cgstAmount ?? (amount * cgst) / 100);
  const sgstAmount = round2(row.sgstAmount ?? (amount * sgst) / 100);
  const igstAmount = round2(row.igstAmount ?? (amount * igst) / 100);
  const whtAmount = round2(row.whtAmount ?? (amount * wht) / 100);

  return {
    lineNo: toNumber(row.lineNo, index + 1),
    jobNo: toNumber(row.jobNo, defaultJobNo),
    invoiceNo: String(row.invoiceNo || ""),
    jobDate: row.jobDate || null,
    code: String(row.code || ""),
    description: String(row.description || ""),
    chargedPer: String(row.chargedPer || "DOCS"),
    currency: String(row.currency || "AED"),
    size: String(row.size || "20"),
    type: String(row.type || "GP"),
    qty,
    rate,
    amount,
    serviceCode: String(row.serviceCode || ""),
    gstVat,
    gstVatAmount,
    cgst,
    cgstAmount,
    sgst,
    sgstAmount,
    igst,
    igstAmount,
    wht,
    whtAmount,
    totalAmount: round2(
      amount + gstVatAmount + cgstAmount + sgstAmount + igstAmount - whtAmount,
    ),
    remark: String(row.remark || ""),
    exRate,
  };
}

function normalizePayments(rows = []) {
  if (!Array.isArray(rows)) return [];

  return rows.map((row) => ({
    vocNo: String(row?.vocNo || ""),
    vocDate: row?.vocDate || null,
    invoice: String(row?.invoice || ""),
    payAmount: round2(row?.payAmount),
    tdsAmount: round2(row?.tdsAmount),
    clientBank: String(row?.clientBank || ""),
    bankBranch: String(row?.bankBranch || ""),
    clientAcNo: String(row?.clientAcNo || ""),
    payType: String(row?.payType || "BANK TRANSFER"),
    chequeNo: String(row?.chequeNo || ""),
    ourBank: String(row?.ourBank || ""),
    tokenNo: String(row?.tokenNo || ""),
    paymentDate: row?.paymentDate || null,
  }));
}

function summarizeLineItems(rows = []) {
  return {
    amount: round2(
      rows.reduce((sum, row) => sum + toNumber(row?.amount, 0), 0),
    ),
    tax: round2(
      rows.reduce(
        (sum, row) =>
          sum +
          toNumber(row?.gstVatAmount, 0) +
          toNumber(row?.cgstAmount, 0) +
          toNumber(row?.sgstAmount, 0) +
          toNumber(row?.igstAmount, 0),
        0,
      ),
    ),
    totalAmount: round2(
      rows.reduce((sum, row) => sum + toNumber(row?.totalAmount, 0), 0),
    ),
    wht: round2(
      rows.reduce((sum, row) => sum + toNumber(row?.whtAmount, 0), 0),
    ),
    cgst: round2(rows.reduce((sum, row) => sum + toNumber(row?.cgst, 0), 0)),
    sgst: round2(rows.reduce((sum, row) => sum + toNumber(row?.sgst, 0), 0)),
    igst: round2(rows.reduce((sum, row) => sum + toNumber(row?.igst, 0), 0)),
  };
}

function normalizePayload(payload = {}) {
  const jobNo = toNumber(payload.jobNo, 0);
  const lineItems = Array.isArray(payload.lineItems)
    ? payload.lineItems.map((row, index) =>
        normalizeLineItem(row, index, jobNo),
      )
    : [];
  const payments = normalizePayments(payload.payments || []);
  const summary = summarizeLineItems(lineItems);

  const payAmount = round2(payload.payAmount ?? 0);
  const tdsAmount = round2(payload.tdsAmount ?? 0);
  const totalAmount = round2(payload.totalAmount ?? summary.totalAmount);

  return {
    ...payload,
    jobNo,
    exRate: toNumber(payload.exRate, 1),
    amount: round2(payload.amount ?? summary.amount),
    tax: round2(payload.tax ?? summary.tax),
    totalAmount,
    payAmount,
    tdsAmount,
    balanceAmount: round2(
      payload.balanceAmount ?? totalAmount - payAmount - tdsAmount,
    ),
    cgst: round2(payload.cgst ?? summary.cgst),
    sgst: round2(payload.sgst ?? summary.sgst),
    igst: round2(payload.igst ?? summary.igst),
    wht: round2(payload.wht ?? summary.wht),
    actualTotal: round2(payload.actualTotal ?? totalAmount),
    actualJob: round2(payload.actualJob ?? 0),
    actualInvoice: round2(payload.actualInvoice ?? 0),
    credit: round2(payload.credit ?? 0),
    creditDays: toNumber(payload.creditDays, 0),
    payableAt: String(payload.payableAt || "AED"),
    bankName: String(payload.bankName || "DUBAI ISLAMIC BANK (AED)"),
    partyName: String(payload.partyName || ""),
    invoiceNo: String(payload.invoiceNo || ""),
    customerName: String(payload.customerName || ""),
    branch: String(payload.branch || ""),
    voyage: String(payload.voyage || ""),
    vesselName: String(payload.vesselName || ""),
    pol: String(payload.pol || ""),
    fpod: String(payload.fpod || ""),
    remarks: String(payload.remarks || ""),
    createdBy: String(payload.createdBy || ""),
    checker: String(payload.checker || ""),
    checkedBy: String(payload.checkedBy || ""),
    lineItems,
    payments,
  };
}

async function ensureJobExists(jobNo) {
  if (!Number.isFinite(Number(jobNo)) || Number(jobNo) <= 0) {
    throw new AppError("Job No is required", 400);
  }

  const options = await invoiceRepository.getJobOptions();
  const exists = options.some((item) => Number(item.jobNo) === Number(jobNo));

  if (!exists) {
    throw new AppError("Done booking not found for selected Job No", 400);
  }
}

const invoiceCrudService = createResourceService({
  repository: invoiceRepository,
  notFoundMessage: "Invoice record not found",
  createMethod: "create",
  beforeCreate: async (payload) => {
    await ensureJobExists(payload.jobNo);
  },
  beforeUpdate: async (patch) => {
    if (typeof patch.jobNo !== "undefined") {
      await ensureJobExists(patch.jobNo);
    }
  },
  mapCreatePayload: (payload) => normalizePayload(payload),
  mapUpdatePatch: (patch) => normalizePayload(patch),
});

const invoiceService = {
  ...invoiceCrudService,
  getJobOptions() {
    return invoiceRepository.getJobOptions();
  },
  getSearchSnapshot({ jobNo, invoiceType }) {
    return invoiceRepository.getSearchSnapshot({ jobNo, invoiceType });
  },
};

export { invoiceService };
