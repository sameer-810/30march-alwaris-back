import { BillOfLadingModel } from "./bill-of-lading.model.js";
import { BookingModel } from "../booking/booking.model.js";
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
  model: BillOfLadingModel,
  counterModel: CounterModel,
  counterId: "billOfLadingHblNo",
  fieldName: "hblNo",
});

function parseContainerNumbers(value) {
  return String(value || "")
    .split(/[\n,]+/)
    .map((item) => item.trim())
    .filter(Boolean);
}

function getPortName(value) {
  if (!value) return "";
  if (typeof value === "string") return "";
  return String(value?.portName || "").trim();
}

const billOfLadingRepository = {
  createWithAutoHblNo(data) {
    return counterHelpers.createWithAutoValue(data);
  },

  async getNextBlNumber() {
    const counter = await CounterModel.findByIdAndUpdate(
      "billOfLadingBlNumber",
      { $inc: { seq: 1 } },
      { upsert: true, new: true, setDefaultsOnInsert: true },
    ).lean();

    const year = new Date().getFullYear();
    return `JEA/SCTF/${counter.seq}/${year}`;
  },

  async getJobOptions() {
    const bookingRows = await BookingModel.find({ isDeleted: false })
      .select(
        "jobNo shipper consignee portOfLoading portOfDestination shipmentDetails.generatedReference shipmentDetails.containerNo",
      )
      .populate({ path: "portOfLoading", select: "portName" })
      .populate({ path: "portOfDestination", select: "portName" })
      .sort({ jobNo: -1 })
      .lean();

    const grouped = new Map();

    for (const row of bookingRows) {
      if (!Number.isFinite(Number(row.jobNo))) continue;

      const jobNo = Number(row.jobNo);
      if (!grouped.has(jobNo)) {
        grouped.set(jobNo, {
          jobNo,
          references: new Set(),
          containers: [],
          shipper: "",
          consignee: "",
          portOfLoading: "",
          portOfDelivery: "",
        });
      }

      const bucket = grouped.get(jobNo);
      if (!bucket.shipper) {
        bucket.shipper = String(row.shipper || "").trim();
      }
      if (!bucket.consignee) {
        bucket.consignee = String(row.consignee || "").trim();
      }
      if (!bucket.portOfLoading) {
        bucket.portOfLoading = getPortName(row.portOfLoading);
      }
      if (!bucket.portOfDelivery) {
        bucket.portOfDelivery = getPortName(row.portOfDestination);
      }

      const details = Array.isArray(row.shipmentDetails)
        ? row.shipmentDetails
        : [];

      for (const item of details) {
        const referenceNo = String(item?.generatedReference || "").trim();
        const containerNos = parseContainerNumbers(item?.containerNo);

        if (referenceNo) {
          bucket.references.add(referenceNo);
        }

        for (const containerNo of containerNos) {
          bucket.containers.push({
            referenceNo,
            containerNo,
          });
        }
      }
    }

    return Array.from(grouped.values())
      .map((item) => ({
        jobNo: item.jobNo,
        references: Array.from(item.references),
        containers: item.containers,
        shipper: item.shipper,
        consignee: item.consignee,
        portOfLoading: item.portOfLoading,
        portOfDelivery: item.portOfDelivery,
      }))
      .sort((a, b) => b.jobNo - a.jobNo);
  },

  findById(id) {
    return findActiveById(BillOfLadingModel, id);
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    await counterHelpers.ensureLegacyValues();

    const query = { isDeleted: false };

    if (search) {
      const safeSearch = escapeRegex(search);
      const asNumber = Number(search);
      const hasNumber =
        !Number.isNaN(asNumber) && String(asNumber) === String(search).trim();

      query.$or = [
        { referenceNo: { $regex: safeSearch, $options: "i" } },
        { status: { $regex: safeSearch, $options: "i" } },
        { blNumber: { $regex: safeSearch, $options: "i" } },
        {
          "consignmentDetails.shipper": {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          "consignmentDetails.consignee": {
            $regex: safeSearch,
            $options: "i",
          },
        },
        {
          "containerDetails.containerNo": { $regex: safeSearch, $options: "i" },
        },
        {
          "containerDetails.shippingBill": {
            $regex: safeSearch,
            $options: "i",
          },
        },
        { "containerDetails.hbl": { $regex: safeSearch, $options: "i" } },
      ];

      if (hasNumber) {
        query.$or.push({ hblNo: asNumber });
        query.$or.push({ jobNo: asNumber });
      }
    }

    return runPagedQuery({
      model: BillOfLadingModel,
      query,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(BillOfLadingModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(BillOfLadingModel, id);
  },
};

export { billOfLadingRepository };
