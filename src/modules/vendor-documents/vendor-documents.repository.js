import { BookingModel } from "../booking/booking.model.js";
import { VendorDocumentsModel } from "./vendor-documents.model.js";

const bookingPopulate = [
  { path: "expenseDetails.vendor", select: "vendorName customerName" },
  { path: "expenseDetails.chargeDescription", select: "description" },
];

const vendorDocumentsRepository = {
  async getJobOptions() {
    const rows = await BookingModel.find({ isDeleted: false })
      .select("jobNo")
      .sort({ jobNo: -1 })
      .lean();

    const seen = new Set();
    const options = [];

    for (const row of rows) {
      const jobNo = Number(row.jobNo);
      if (!Number.isFinite(jobNo) || seen.has(jobNo)) continue;
      seen.add(jobNo);
      options.push({ jobNo });
    }

    return options;
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

    const existing = await VendorDocumentsModel.findOne({
      jobNo,
      isDeleted: false,
    }).lean();

    const nextRows = Array.isArray(existing?.vendorRowFiles)
      ? [...existing.vendorRowFiles]
      : [];

    const idx = nextRows.findIndex((item) => item.rowKey === rowKey);
    if (idx >= 0) {
      nextRows[idx] = rowPayload;
    } else {
      nextRows.push(rowPayload);
    }

    return VendorDocumentsModel.findOneAndUpdate(
      { jobNo, isDeleted: false },
      {
        $set: {
          bookingId,
          vendorRowFiles: nextRows,
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
};

export { vendorDocumentsRepository };
