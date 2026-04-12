import { createResourceService } from "../common/shared-crud/createResourceService.js";
import { bookingRepository } from "./booking.repository.js";

function normalizeAmountRow(row = {}) {
  const qty = Number(row.qty || 0);
  const rate = Number(row.rate || 0);
  const exRate = Number(row.exRate || 0);
  const amount = Number((qty * rate * exRate).toFixed(2));

  return {
    ...row,
    qty,
    rate,
    exRate,
    amount,
  };
}

function normalizeAmountRows(items = []) {
  return items.map((row) => normalizeAmountRow(row));
}

function calculateTotalInAed(items = []) {
  return Number(
    items.reduce((sum, row) => sum + Number(row?.amount || 0), 0).toFixed(2),
  );
}

const bookingCrudService = createResourceService({
  repository: bookingRepository,
  notFoundMessage: "Booking record not found",
  createMethod: "createWithAutoJobNo",
  mapCreatePayload: (payload) => {
    const incomeDetails = normalizeAmountRows(payload.incomeDetails || []);
    const expenseDetails = normalizeAmountRows(payload.expenseDetails || []);

    return {
      ...payload,
      incomeDetails,
      expenseDetails,
      incomeTotalInAed: calculateTotalInAed(incomeDetails),
      expenseTotalInAed: calculateTotalInAed(expenseDetails),
      netAmountInAed: Number(
        (
          calculateTotalInAed(incomeDetails) -
          calculateTotalInAed(expenseDetails)
        ).toFixed(2),
      ),
    };
  },
  mapUpdatePatch: (patch) => {
    const nextPatch = { ...patch };

    if (Array.isArray(nextPatch.incomeDetails)) {
      nextPatch.incomeDetails = normalizeAmountRows(nextPatch.incomeDetails);
      nextPatch.incomeTotalInAed = calculateTotalInAed(nextPatch.incomeDetails);
    }

    if (Array.isArray(nextPatch.expenseDetails)) {
      nextPatch.expenseDetails = normalizeAmountRows(nextPatch.expenseDetails);
      nextPatch.expenseTotalInAed = calculateTotalInAed(
        nextPatch.expenseDetails,
      );
    }

    if (
      typeof nextPatch.incomeTotalInAed === "number" ||
      typeof nextPatch.expenseTotalInAed === "number"
    ) {
      const incomeTotal =
        typeof nextPatch.incomeTotalInAed === "number"
          ? nextPatch.incomeTotalInAed
          : 0;
      const expenseTotal =
        typeof nextPatch.expenseTotalInAed === "number"
          ? nextPatch.expenseTotalInAed
          : 0;
      nextPatch.netAmountInAed = Number(
        (incomeTotal - expenseTotal).toFixed(2),
      );
    }

    return nextPatch;
  },
});

const bookingService = {
  ...bookingCrudService,
  getNextReference() {
    return bookingRepository.getNextGeneratedReference();
  },
};

export { bookingService };
