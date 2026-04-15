import { CostSheetModel } from "./cost-sheet.model.js";
import { BookingModel } from "../booking/booking.model.js";
import {
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
} from "../common/shared-crud/resourceRepositoryHelpers.js";

function normalizeName(value, ...keys) {
  if (!value) return "";
  if (typeof value === "string") return value.trim();

  for (const key of keys) {
    const next = String(value?.[key] || "").trim();
    if (next) return next;
  }

  return "";
}

function toRefId(value) {
  if (!value) return null;
  if (typeof value === "string") return value;
  return String(value?._id || "") || null;
}

const costSheetRepository = {
  create(data) {
    return CostSheetModel.create(data);
  },

  findById(id) {
    return findActiveById(CostSheetModel, id);
  },

  async findMany({ search, status, page, limit, sortBy, sortDir }) {
    const query = { isDeleted: false };

    if (status) {
      query.status = status;
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
      model: CostSheetModel,
      query,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(CostSheetModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(CostSheetModel, id);
  },

  async getDoneBookingJobOptions() {
    const rows = await BookingModel.find({
      isDeleted: false,
      status: "Done",
    })
      .select("jobNo")
      .sort({ jobNo: -1 })
      .lean();

    return rows
      .filter((item) => Number.isFinite(Number(item?.jobNo)))
      .map((item) => ({
        jobNo: Number(item.jobNo),
      }));
  },

  async getBookingSnapshotByJobNo(jobNo) {
    const booking = await BookingModel.findOne({
      isDeleted: false,
      status: "Done",
      jobNo,
    })
      .populate({ path: "bookingParty", select: "customerName" })
      .populate({ path: "portOfLoading", select: "portName" })
      .populate({ path: "portOfDestination", select: "portName" })
      .populate({
        path: "incomeDetails.incomeBillingParty",
        select: "customerName",
      })
      .populate({
        path: "incomeDetails.chargeDescription",
        select: "counter description",
      })
      .populate({ path: "expenseDetails.vendor", select: "vendorName" })
      .populate({
        path: "expenseDetails.chargeDescription",
        select: "counter description",
      })
      .lean();

    if (!booking) return null;

    const shipmentRows = Array.isArray(booking.shipmentDetails)
      ? booking.shipmentDetails
      : [];

    const etd =
      shipmentRows.find((item) => item?.etd)?.etd ||
      booking.jobDate ||
      booking.createdAt ||
      null;

    const eta = shipmentRows.find((item) => item?.eta)?.eta || null;

    const volume = Number(
      shipmentRows
        .reduce((sum, item) => sum + Number(item?.volume || 0), 0)
        .toFixed(3),
    );

    const grossWeight = Number(
      shipmentRows
        .reduce((sum, item) => sum + Number(item?.grossWeight || 0), 0)
        .toFixed(3),
    );

    const qty = Number(
      shipmentRows.reduce((sum, item) => sum + Number(item?.qty || 0), 0),
    );

    const incomeDetails = Array.isArray(booking.incomeDetails)
      ? booking.incomeDetails.map((item, idx) => ({
          id: `inc-${idx + 1}`,
          chargeDescriptionId: toRefId(item?.chargeDescription),
          chargeDescriptionName:
            normalizeName(item?.chargeDescription, "description") ||
            String(item?.chargeDescriptionName || ""),
          chargeDescriptionCode: String(item?.chargeDescription?.counter || ""),
          billingPartyId: toRefId(item?.incomeBillingParty),
          billingPartyName:
            normalizeName(item?.incomeBillingParty, "customerName") ||
            String(item?.incomeBillingPartyName || ""),
          chargedPer: item?.chargedPer || "DOCS",
          qty: Number(item?.qty || 0),
          size: String(item?.size || "20"),
          type: String(item?.type || "GP"),
          currency: String(item?.currency || "USD"),
          rate: Number(item?.rate || 0),
          amount: Number(item?.amount || 0),
          remarks: String(item?.remarks || ""),
        }))
      : [];

    const expenseDetails = Array.isArray(booking.expenseDetails)
      ? booking.expenseDetails.map((item, idx) => ({
          id: `exp-${idx + 1}`,
          chargeDescriptionId: toRefId(item?.chargeDescription),
          chargeDescriptionName:
            normalizeName(item?.chargeDescription, "description") ||
            String(item?.chargeDescriptionName || ""),
          chargeDescriptionCode: String(item?.chargeDescription?.counter || ""),
          vendorId: toRefId(item?.vendor),
          vendorName:
            normalizeName(item?.vendor, "vendorName", "customerName") ||
            String(item?.vendorLabel || ""),
          chargedPer: item?.chargedPer || "DOCS",
          qty: Number(item?.qty || 0),
          size: String(item?.size || "20"),
          type: String(item?.type || "GP"),
          currency: String(item?.currency || "USD"),
          rate: Number(item?.rate || 0),
          amount: Number(item?.amount || 0),
          remarks: String(item?.remarks || ""),
        }))
      : [];

    return {
      bookingId: String(booking._id),
      jobNo: Number(booking.jobNo),
      bookingParty: normalizeName(booking.bookingParty, "customerName"),
      shipper: String(booking.shipper || ""),
      consignee: String(booking.consignee || ""),
      portOfLoading: normalizeName(booking.portOfLoading, "portName"),
      portOfDestination: normalizeName(booking.portOfDestination, "portName"),
      modeOfTransport: String(booking.modeOfTransport || ""),
      etd,
      eta,
      volume,
      grossWeight,
      qty,
      incomeDetails,
      expenseDetails,
    };
  },
};

export { costSheetRepository };
