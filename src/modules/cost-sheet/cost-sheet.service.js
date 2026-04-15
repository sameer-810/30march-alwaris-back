import { createResourceService } from "../common/shared-crud/createResourceService.js";
import { AppError } from "../../utils/AppError.js";
import { costSheetRepository } from "./cost-sheet.repository.js";

function normalizeLineRow(row = {}) {
  const qty = Number(row.qty || 0);
  const rate = Number(row.rate || 0);
  const amount = Number((qty * rate).toFixed(2));

  return {
    chargeDescription: row.chargeDescriptionId || undefined,
    chargeDescriptionName: String(row.chargeDescriptionName || ""),
    chargeDescriptionCode: String(row.chargeDescriptionCode || ""),
    billingParty: row.billingPartyId || undefined,
    billingPartyName: String(row.billingPartyName || ""),
    vendor: row.vendorId || undefined,
    vendorName: String(row.vendorName || ""),
    chargedPer: row.chargedPer || "DOCS",
    qty,
    size: row.size || "20",
    type: row.type || "GP",
    currency: row.currency || "USD",
    rate,
    amount,
    remarks: String(row.remarks || ""),
  };
}

function normalizeRows(rows = []) {
  return Array.isArray(rows) ? rows.map((row) => normalizeLineRow(row)) : [];
}

function sumByCurrency(rows, currency) {
  return Number(
    rows
      .filter((row) => String(row?.currency || "").toUpperCase() === currency)
      .reduce((sum, row) => sum + Number(row?.amount || 0), 0)
      .toFixed(2),
  );
}

function calculateTotals(incomeDetails, expenseDetails) {
  const aedIncome = sumByCurrency(incomeDetails, "AED");
  const aedExpense = sumByCurrency(expenseDetails, "AED");
  const usdIncome = sumByCurrency(incomeDetails, "USD");
  const usdExpense = sumByCurrency(expenseDetails, "USD");

  return {
    aedIncome,
    aedExpense,
    aedProfit: Number((aedIncome - aedExpense).toFixed(2)),
    usdIncome,
    usdExpense,
    usdProfit: Number((usdIncome - usdExpense).toFixed(2)),
  };
}

async function ensureBookingExists(jobNo) {
  const snapshot = await costSheetRepository.getBookingSnapshotByJobNo(jobNo);
  if (!snapshot) {
    throw new AppError("Done booking not found for selected Job No", 400);
  }
}

function validatePendingApprovalPayload(payload) {
  const incomeLength = Array.isArray(payload?.incomeDetails)
    ? payload.incomeDetails.length
    : 0;
  const expenseLength = Array.isArray(payload?.expenseDetails)
    ? payload.expenseDetails.length
    : 0;

  if (!Number.isFinite(Number(payload?.jobNo)) || Number(payload?.jobNo) <= 0) {
    throw new AppError("Job selection is required", 400);
  }

  if (incomeLength + expenseLength <= 0) {
    throw new AppError(
      "At least one income or expense row is required for approval",
      400,
    );
  }
}

const costSheetCrudService = createResourceService({
  repository: costSheetRepository,
  notFoundMessage: "Cost sheet not found",
  createMethod: "create",
  beforeCreate: async (payload) => {
    await ensureBookingExists(Number(payload.jobNo));
    if (payload.status === "Pending Approval") {
      validatePendingApprovalPayload(payload);
    }
  },
  beforeUpdate: async (patch) => {
    if (patch.jobNo) {
      await ensureBookingExists(Number(patch.jobNo));
    }

    if (patch.status === "Pending Approval") {
      validatePendingApprovalPayload(patch);
    }
  },
  mapCreatePayload: (payload) => {
    const incomeDetails = normalizeRows(payload.incomeDetails || []);
    const expenseDetails = normalizeRows(payload.expenseDetails || []);

    return {
      ...payload,
      jobNo: Number(payload.jobNo),
      volume: Number(payload.volume || 0),
      grossWeight: Number(payload.grossWeight || 0),
      qty: Number(payload.qty || 0),
      incomeDetails,
      expenseDetails,
      totals: calculateTotals(incomeDetails, expenseDetails),
      status: payload.status || "Draft",
    };
  },
  mapUpdatePatch: (patch) => {
    const nextPatch = { ...patch };

    if (Array.isArray(nextPatch.incomeDetails)) {
      nextPatch.incomeDetails = normalizeRows(nextPatch.incomeDetails);
    }

    if (Array.isArray(nextPatch.expenseDetails)) {
      nextPatch.expenseDetails = normalizeRows(nextPatch.expenseDetails);
    }

    if (
      Array.isArray(nextPatch.incomeDetails) ||
      Array.isArray(nextPatch.expenseDetails)
    ) {
      nextPatch.totals = calculateTotals(
        nextPatch.incomeDetails || [],
        nextPatch.expenseDetails || [],
      );
    }

    if (typeof nextPatch.jobNo !== "undefined") {
      nextPatch.jobNo = Number(nextPatch.jobNo);
    }

    if (typeof nextPatch.qty !== "undefined") {
      nextPatch.qty = Number(nextPatch.qty || 0);
    }

    return nextPatch;
  },
});

const costSheetService = {
  ...costSheetCrudService,
  getJobOptions() {
    return costSheetRepository.getDoneBookingJobOptions();
  },
  getBookingSnapshot(jobNo) {
    return costSheetRepository.getBookingSnapshotByJobNo(jobNo);
  },
};

export { costSheetService };
