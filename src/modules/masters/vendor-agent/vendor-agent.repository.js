const { VendorAgentModel } = require("./vendor-agent.model");
const { CounterModel } = require("../../common/shared-crud/counter.model");
const {
  escapeRegex,
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
} = require("../../common/shared-crud/resourceRepositoryHelpers");

const CODE_PREFIX = "IC";
const CODE_PAD = 4;

function formatCode(seq) {
  return `${CODE_PREFIX}${String(seq).padStart(CODE_PAD, "0")}`;
}

async function getNextVendorAgentCode() {
  const counter = await CounterModel.findByIdAndUpdate(
    "vendorAgentCode",
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();

  return formatCode(counter.seq);
}

async function assignCodeIfMissing(docId) {
  const code = await getNextVendorAgentCode();
  await VendorAgentModel.updateOne(
    { _id: docId, $or: [{ code: { $exists: false } }, { code: null }] },
    { $set: { code } },
  );
}

async function ensureLegacyCodes() {
  const legacyRows = await VendorAgentModel.find({
    isDeleted: false,
    $or: [{ code: { $exists: false } }, { code: null }],
  })
    .sort({ createdAt: 1 })
    .select("_id")
    .lean();

  for (const row of legacyRows) {
    await assignCodeIfMissing(row._id);
  }
}

const vendorAgentRepository = {
  findById(id) {
    return findActiveById(VendorAgentModel, id, {
      path: "vendorTypeId",
      select: "vendorType",
    });
  },

  async createWithAutoCode(data) {
    const code = await getNextVendorAgentCode();
    return VendorAgentModel.create({ ...data, code });
  },

  async findMany({ search, vendorTypeId, page, limit, sortBy, sortDir }) {
    await ensureLegacyCodes();

    const q = { isDeleted: false };
    if (vendorTypeId) q.vendorTypeId = vendorTypeId;

    const resolvedSortBy = sortBy;

    if (search) {
      const safeSearch = escapeRegex(search);
      q.$or = [
        { code: { $regex: safeSearch, $options: "i" } },
        { vendorName: { $regex: safeSearch, $options: "i" } },
        { emailId: { $regex: safeSearch, $options: "i" } },
        { city: { $regex: safeSearch, $options: "i" } },
        { state: { $regex: safeSearch, $options: "i" } },
        { contactPerson: { $regex: safeSearch, $options: "i" } },
        { contactNo: { $regex: safeSearch, $options: "i" } },
      ];
    }

    return runPagedQuery({
      model: VendorAgentModel,
      query: q,
      page,
      limit,
      sortBy: resolvedSortBy,
      sortDir,
      populate: { path: "vendorTypeId", select: "vendorType" },
    });
  },

  updateById(id, patch) {
    return updateActiveById(VendorAgentModel, id, patch, {
      path: "vendorTypeId",
      select: "vendorType",
    });
  },

  softDeleteById(id) {
    return softDeleteActiveById(VendorAgentModel, id);
  },
};

module.exports = { vendorAgentRepository };
