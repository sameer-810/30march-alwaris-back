import { BookingModel } from "./booking.model.js";
import { CounterModel } from "../common/shared-crud/counter.model.js";
import {
  createCounterFieldHelpers,
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
} from "../common/shared-crud/resourceRepositoryHelpers.js";

const counterHelpers = createCounterFieldHelpers({
  model: BookingModel,
  counterModel: CounterModel,
  counterId: "bookingJobNo",
  fieldName: "jobNo",
});

const BOOKING_POPULATE = [
  { path: "rateAgreedBy", select: "employeeName" },
  { path: "bookingParty", select: "customerName" },
  { path: "kindAttention", select: "employeeName" },
  { path: "portOfLoading", select: "portName" },
  { path: "portOfDestination", select: "portName" },
  { path: "terms", select: "terms" },
  { path: "lineOfBix", select: "lineOfBix" },
  { path: "shipmentDetails.vessel", select: "vesselName" },
  { path: "billingParty", select: "customerName" },
  { path: "incomeDetails.incomeBillingParty", select: "customerName" },
  { path: "incomeDetails.chargeDescription", select: "description" },
  { path: "expenseDetails.vendor", select: "vendorName customerName" },
  { path: "expenseDetails.chargeDescription", select: "description" },
];

const BOOKING_LIST_POPULATE = [
  { path: "bookingParty", select: "customerName" },
];

const bookingRepository = {
  async createWithAutoJobNo(data) {
    return counterHelpers.createWithAutoValue(data);
  },

  async getNextGeneratedReference() {
    const counter = await CounterModel.findByIdAndUpdate(
      "bookingGeneratedReference",
      { $inc: { seq: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    return `REF-${String(counter.seq).padStart(4, "0")}`;
  },

  findById(id) {
    return findActiveById(BookingModel, id, BOOKING_POPULATE);
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    const q = { isDeleted: false };
    if (search) {
      const asNumber = Number(search);
      const hasNumber =
        !Number.isNaN(asNumber) && String(asNumber) === String(search).trim();

      if (hasNumber) {
        // Match exact job numbers or text index
        q.$or = [{ $text: { $search: search } }, { jobNo: asNumber }];
      } else {
        // Match against the indexed text columns natively
        q.$text = { $search: search };
      }
    }

    return runPagedQuery({
      model: BookingModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
      populate: BOOKING_LIST_POPULATE,
    });
  },

  updateById(id, patch) {
    return updateActiveById(BookingModel, id, patch, BOOKING_POPULATE);
  },

  softDeleteById(id) {
    return softDeleteActiveById(BookingModel, id);
  },
};

export { bookingRepository };
