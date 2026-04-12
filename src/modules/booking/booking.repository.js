import { BookingModel } from "./booking.model.js";
import { CounterModel } from "../common/shared-crud/counter.model.js";
import {
  createCounterFieldHelpers,
  escapeRegex,
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
    return findActiveById(BookingModel, id, [
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
      { path: "expenseDetails.vendorName", select: "vendorName customerName" },
      { path: "expenseDetails.chargeDescription", select: "description" },
    ]);
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    await counterHelpers.ensureLegacyValues();

    const q = { isDeleted: false };
    if (search) {
      const safeSearch = escapeRegex(search);
      const asNumber = Number(search);
      const hasNumber =
        !Number.isNaN(asNumber) && String(asNumber) === String(search).trim();

      q.$or = [
        { shipper: { $regex: safeSearch, $options: "i" } },
        { consignee: { $regex: safeSearch, $options: "i" } },
        { modeOfTransport: { $regex: safeSearch, $options: "i" } },
        { exportImport: { $regex: safeSearch, $options: "i" } },
        { status: { $regex: safeSearch, $options: "i" } },
        { line: { $regex: safeSearch, $options: "i" } },
        { mbl: { $regex: safeSearch, $options: "i" } },
        { orderReference: { $regex: safeSearch, $options: "i" } },
        {
          "shipmentDetails.generatedReference": {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          "shipmentDetails.containerNo": { $regex: safeSearch, $options: "i" },
        },
        { "shipmentDetails.hbl": { $regex: safeSearch, $options: "i" } },
      ];

      if (hasNumber) {
        q.$or.push({ jobNo: asNumber });
      }
    }

    return runPagedQuery({
      model: BookingModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
      populate: [
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
        {
          path: "expenseDetails.vendorName",
          select: "vendorName customerName",
        },
        { path: "expenseDetails.chargeDescription", select: "description" },
      ],
    });
  },

  updateById(id, patch) {
    return updateActiveById(BookingModel, id, patch, [
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
      { path: "expenseDetails.vendorName", select: "vendorName customerName" },
      { path: "expenseDetails.chargeDescription", select: "description" },
    ]);
  },

  softDeleteById(id) {
    return softDeleteActiveById(BookingModel, id);
  },
};

export { bookingRepository };
