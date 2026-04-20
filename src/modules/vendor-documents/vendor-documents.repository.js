import { BookingModel } from "../booking/booking.model.js";
import { VendorDocumentsModel } from "./vendor-documents.model.js";

const bookingPopulate = [
  { path: "expenseDetails.vendor", select: "vendorName customerName" },
  { path: "expenseDetails.chargeDescription", select: "description" },
];

const vendorDocumentsRepository = {
  async getJobOptions() {
    const jobNos = await BookingModel.distinct("jobNo", { isDeleted: false });
    return jobNos
      .map((jobNo) => ({ jobNo: Number(jobNo) }))
      .filter((j) => Number.isFinite(j.jobNo))
      .sort((a, b) => b.jobNo - a.jobNo);
  },

  getBookingByJobNo(jobNo) {
    return BookingModel.findOne({ jobNo, isDeleted: false })
      .populate(bookingPopulate)
      .lean();
  },

  findByJobNo(jobNo) {
    return VendorDocumentsModel.findOne({ jobNo, isDeleted: false }).lean();
  },

  async saveMasterBlFile({ jobNo, bookingId, file }) {
    return VendorDocumentsModel.findOneAndUpdate(
      { jobNo, isDeleted: false },
      {
        $set: {
          bookingId,
          masterBlFile: file,
        },
        $setOnInsert: {
          jobNo,
          isDeleted: false,
        },
      },
      {
        new: true,
        upsert: true,
      },
    ).lean();
  },

  async saveVendorRowFile({
    jobNo,
    bookingId,
    rowKey,
    rowIndex,
    vendor,
    chargeDescription,
    amount,
    file,
  }) {
    const rowPayload = {
      rowKey,
      rowIndex,
      vendor,
      chargeDescription,
      amount,
      file,
    };

    const result = await VendorDocumentsModel.findOneAndUpdate(
      { jobNo, isDeleted: false, "vendorRowFiles.rowKey": rowKey },
      {
        $set: {
          bookingId,
          "vendorRowFiles.$": rowPayload,
        },
      },
      { new: true },
    ).lean();

    if (result) return result;

    return VendorDocumentsModel.findOneAndUpdate(
      { jobNo, isDeleted: false, "vendorRowFiles.rowKey": { $ne: rowKey } },
      {
        $set: { bookingId },
        $push: { vendorRowFiles: rowPayload },
        $setOnInsert: { jobNo, isDeleted: false },
      },
      {
        new: true,
        upsert: true,
      },
    ).lean();
  },
};

export { vendorDocumentsRepository };
