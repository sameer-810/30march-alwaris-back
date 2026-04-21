import { InvoiceModel } from "./invoice.model.js";
import { BookingModel } from "../booking/booking.model.js";
import { CostSheetModel } from "../cost-sheet/cost-sheet.model.js";
import {
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
} from "../common/shared-crud/resourceRepositoryHelpers.js";

function toNumber(value, fallback = 0) {
  const next = Number(value);
  return Number.isFinite(next) ? next : fallback;
}

function round2(value) {
  return Number(toNumber(value, 0).toFixed(2));
}

function buildLineItemTaxAmounts(row = {}) {
  const amount = round2(row.amount);
  const gstVatAmount = round2((amount * toNumber(row.gstVat, 0)) / 100);
  const cgstAmount = round2((amount * toNumber(row.cgst, 0)) / 100);
  const sgstAmount = round2((amount * toNumber(row.sgst, 0)) / 100);
  const igstAmount = round2((amount * toNumber(row.igst, 0)) / 100);
  const whtAmount = round2((amount * toNumber(row.wht, 0)) / 100);
  const totalAmount = round2(
    amount + gstVatAmount + cgstAmount + sgstAmount + igstAmount - whtAmount,
  );

  return {
    amount,
    gstVatAmount,
    cgstAmount,
    sgstAmount,
    igstAmount,
    whtAmount,
    totalAmount,
  };
}

function normalizeName(value, ...keys) {
  if (!value) return "";
  if (typeof value === "string") return value.trim();

  for (const key of keys) {
    const next = String(value?.[key] || "").trim();
    if (next) return next;
  }

  return "";
}

function mapSourceLineItem(item = {}, index, header) {
  const qty = toNumber(item?.qty, 0);
  const rate = toNumber(item?.rate, 0);
  const exRate = toNumber(item?.exRate, 1);
  const amount = round2(toNumber(item?.amount, qty * rate * exRate));

  const base = {
    lineNo: index + 1,
    jobNo: toNumber(header.jobNo, 0),
    invoiceNo: String(header.invoiceNo || ""),
    jobDate: header.jobDate || null,
    code: String(
      item?.chargeDescription?.counter || item?.chargeDescriptionCode || "",
    ),
    description:
      String(
        item?.chargeDescription?.description ||
          item?.chargeDescriptionName ||
          "",
      ) || "",
    chargedPer: String(item?.chargedPer || "DOCS"),
    currency: String(item?.currency || "AED"),
    size: String(item?.size || "20"),
    type: String(item?.type || "GP"),
    qty,
    rate,
    amount,
    serviceCode: String(
      item?.chargeDescription?.counter || item?.chargeDescriptionCode || "",
    ),
    gstVat: 0,
    cgst: 0,
    sgst: 0,
    igst: 0,
    wht: 0,
    remark: String(item?.remarks || ""),
    exRate,
  };

  const taxAmounts = buildLineItemTaxAmounts(base);

  return {
    ...base,
    gstVatAmount: taxAmounts.gstVatAmount,
    cgstAmount: taxAmounts.cgstAmount,
    sgstAmount: taxAmounts.sgstAmount,
    igstAmount: taxAmounts.igstAmount,
    whtAmount: taxAmounts.whtAmount,
    totalAmount: taxAmounts.totalAmount,
  };
}

function summarizeFromLineItems(lineItems = []) {
  const amount = round2(
    lineItems.reduce((sum, row) => sum + toNumber(row.amount, 0), 0),
  );
  const tax = round2(
    lineItems.reduce(
      (sum, row) =>
        sum +
        toNumber(row.gstVatAmount, 0) +
        toNumber(row.cgstAmount, 0) +
        toNumber(row.sgstAmount, 0) +
        toNumber(row.igstAmount, 0),
      0,
    ),
  );
  const totalAmount = round2(
    lineItems.reduce((sum, row) => sum + toNumber(row.totalAmount, 0), 0),
  );
  const wht = round2(
    lineItems.reduce((sum, row) => sum + toNumber(row.whtAmount, 0), 0),
  );

  return {
    amount,
    tax,
    totalAmount,
    wht,
    cgst: round2(
      lineItems.reduce((sum, row) => sum + toNumber(row.cgst, 0), 0),
    ),
    sgst: round2(
      lineItems.reduce((sum, row) => sum + toNumber(row.sgst, 0), 0),
    ),
    igst: round2(
      lineItems.reduce((sum, row) => sum + toNumber(row.igst, 0), 0),
    ),
  };
}

function toTableRow(invoice) {
  return {
    id: String(invoice._id || invoice.id || ""),
    jobNo: toNumber(invoice.jobNo, 0),
    code: String(invoice?.code ?? "").trim(),
    customerName: String(invoice.customerName || ""),
    jobDate: invoice.jobDate || "",
    invoiceNo: String(invoice.invoiceNo || ""),
    invoiceDate: invoice.invoiceDate || "",
    branch: String(invoice.branch || ""),
    amount: toNumber(invoice.amount, 0),
    tax: toNumber(invoice.tax, 0),
    totalAmount: toNumber(invoice.totalAmount, 0),
    payAmount: toNumber(invoice.payAmount, 0),
    tdsAmount: toNumber(invoice.tdsAmount, 0),
    balanceAmount: toNumber(invoice.balanceAmount, 0),
    voyage: String(invoice.voyage || ""),
    vesselName: String(invoice.vesselName || ""),
    pol: String(invoice.pol || ""),
    fpod: String(invoice.fpod || ""),
    cgst: toNumber(invoice.cgst, 0),
    sgst: toNumber(invoice.sgst, 0),
    igst: toNumber(invoice.igst, 0),
    exRate: toNumber(invoice.exRate, 1),
    actualJob: toNumber(invoice.actualJob, 0),
    actualInvoice: toNumber(invoice.actualInvoice, 0),
    credit: toNumber(invoice.credit, 0),
    creditDate: invoice.creditDate || "",
    remarks: String(invoice.remarks || ""),
    createdBy: String(invoice.createdBy || ""),
    checker: String(invoice.checker || ""),
    checkedBy: String(invoice.checkedBy || ""),
    creditDays: toNumber(invoice.creditDays, 0),
    wht: toNumber(invoice.wht, 0),
    actualTotal: toNumber(invoice.actualTotal, 0),
  };
}

const invoiceRepository = {
  create(data) {
    return InvoiceModel.create(data);
  },

  findById(id) {
    return findActiveById(InvoiceModel, id);
  },

  async findMany({ search, page, limit, sortBy, sortDir, invoiceType, jobNo }) {
    const query = { isDeleted: false };

    if (invoiceType) {
      query.invoiceType = invoiceType;
    }

    if (jobNo) {
      query.jobNo = Number(jobNo);
    }

    if (search) {
      const asNumber = Number(search);
      const hasNumber =
        !Number.isNaN(asNumber) && String(asNumber) === String(search).trim();

      if (hasNumber) {
        query.$or = [{ $text: { $search: search } }, { jobNo: asNumber }];
      } else {
        query.$text = { $search: search };
      }
    }

    return runPagedQuery({
      model: InvoiceModel,
      query,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(InvoiceModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(InvoiceModel, id);
  },

  async getJobOptions() {
    const rows = await BookingModel.find({ isDeleted: false, status: "Done" })
      .select("jobNo")
      .sort({ jobNo: -1 })
      .lean();

    return rows
      .filter((item) => Number.isFinite(Number(item?.jobNo)))
      .map((item) => ({ jobNo: Number(item.jobNo) }));
  },

  async getSearchSnapshot({ jobNo, invoiceType }) {
    const booking = await BookingModel.findOne({
      isDeleted: false,
      status: "Done",
      jobNo,
    })
      .populate({ path: "bookingParty", select: "customerName code" })
      .populate({ path: "portOfLoading", select: "portName" })
      .populate({ path: "portOfDestination", select: "portName" })
      .populate({ path: "shipmentDetails.vessel", select: "vesselName" })
      .populate({
        path: "incomeDetails.incomeBillingParty",
        select: "customerName code",
      })
      .populate({
        path: "incomeDetails.chargeDescription",
        select: "counter description",
      })
      .lean();

    if (!booking) return null;

    const approvedCostSheet = await CostSheetModel.findOne({
      isDeleted: false,
      status: "Approved",
      jobNo,
    })
      .sort({ createdAt: -1 })
      .lean();

    const existingInvoices = await InvoiceModel.find({
      isDeleted: false,
      jobNo,
      invoiceType,
    })
      .sort({ createdAt: -1 })
      .lean();

    const shipment = Array.isArray(booking.shipmentDetails)
      ? booking.shipmentDetails[0]
      : null;
    const customerCode =
      String(booking.bookingParty?.code ?? "").trim() ||
      String(booking.incomeDetails?.[0]?.incomeBillingParty?.code ?? "").trim();

    const header = {
      jobNo,
      invoiceNo: existingInvoices[0]?.invoiceNo || "",
      jobDate: booking.jobDate || null,
    };

    const sourceLineItems =
      Array.isArray(existingInvoices[0]?.lineItems) &&
      existingInvoices[0].lineItems.length > 0
        ? existingInvoices[0].lineItems
        : Array.isArray(approvedCostSheet?.incomeDetails) &&
            approvedCostSheet.incomeDetails.length > 0
          ? approvedCostSheet.incomeDetails
          : Array.isArray(booking.incomeDetails)
            ? booking.incomeDetails
            : [];

    const generatedLineItems = sourceLineItems.map((item, index) =>
      mapSourceLineItem(item, index, header),
    );

    const summary = summarizeFromLineItems(generatedLineItems);

    const generatedInvoice = {
      id: `draft-${jobNo}-${String(invoiceType).replace(/\s+/g, "-").toLowerCase()}`,
      jobNo,
      invoiceType,
      bookingId: String(booking._id),
      costSheetId: approvedCostSheet?._id ? String(approvedCostSheet._id) : "",
      invoiceNo: "",
      invoiceDate: "",
      code: customerCode,
      customerName:
        normalizeName(booking.bookingParty, "customerName") ||
        normalizeName(
          booking.incomeDetails?.[0]?.incomeBillingParty,
          "customerName",
        ),
      jobDate: booking.jobDate || "",
      branch: "",
      amount: summary.amount,
      tax: summary.tax,
      totalAmount: summary.totalAmount,
      payAmount: 0,
      tdsAmount: 0,
      balanceAmount: summary.totalAmount,
      voyage: String(shipment?.voyage || ""),
      vesselName: normalizeName(shipment?.vessel, "vesselName"),
      pol: normalizeName(booking.portOfLoading, "portName"),
      fpod: normalizeName(booking.portOfDestination, "portName"),
      cgst: summary.cgst,
      sgst: summary.sgst,
      igst: summary.igst,
      exRate: 1,
      actualJob: 0,
      actualInvoice: 0,
      credit: 0,
      creditDate: "",
      remarks: "",
      createdBy: "",
      checker: "",
      checkedBy: "",
      creditDays: 0,
      wht: summary.wht,
      actualTotal: summary.totalAmount,
      payableAt: "AED",
      bankName: "DUBAI ISLAMIC BANK (AED)",
      partyName:
        normalizeName(booking.bookingParty, "customerName") ||
        normalizeName(
          booking.incomeDetails?.[0]?.incomeBillingParty,
          "customerName",
        ),
      lineItems: generatedLineItems,
      payments: [],
    };

    const selectedInvoice = existingInvoices[0] || generatedInvoice;

    return {
      bookingId: String(booking._id),
      costSheetId: approvedCostSheet?._id ? String(approvedCostSheet._id) : "",
      invoiceType,
      tableRows:
        existingInvoices.length > 0
          ? existingInvoices.map((item) => toTableRow(item))
          : [toTableRow(generatedInvoice)],
      selectedInvoice,
      lineItems:
        Array.isArray(selectedInvoice.lineItems) &&
        selectedInvoice.lineItems.length > 0
          ? selectedInvoice.lineItems
          : generatedLineItems,
      payableSection: {
        payableAt: selectedInvoice.payableAt || "AED",
        bankName: selectedInvoice.bankName || "DUBAI ISLAMIC BANK (AED)",
      },
      paymentTypeOptions: ["CHEQUE", "CASH", "BANK TRANSFER"],
      bankOptions: [
        "DUBAI ISLAMIC BANK (AED)",
        "ABU DHABI ISLAMIC BANK",
        "ABU DHABI ISLAMIC BANK (AED)",
      ],
    };
  },
};

export { invoiceRepository };
