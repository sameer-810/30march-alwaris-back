const { VesselModel } = require("./vessel.model");
const { CounterModel } = require("../../common/shared-crud/counter.model");
const {
  createCounterFieldHelpers,
  escapeRegex,
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
} = require("../../common/shared-crud/resourceRepositoryHelpers");

const codeHelpers = createCounterFieldHelpers({
  model: VesselModel,
  counterModel: CounterModel,
  counterId: "vesselCode",
  fieldName: "code",
});

const vesselRepository = {
  async createWithAutoCode(data) {
    return codeHelpers.createWithAutoValue(data);
  },

  findById(id) {
    return findActiveById(VesselModel, id);
  },

  findByName(vesselName) {
    return VesselModel.findOne({ vesselName, isDeleted: false }).lean();
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    await codeHelpers.ensureLegacyValues();

    const q = { isDeleted: false };

    if (search) {
      const safeSearch = escapeRegex(search);
      q.vesselName = { $regex: safeSearch, $options: "i" };
    }

    return runPagedQuery({
      model: VesselModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(VesselModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(VesselModel, id);
  },
};

module.exports = { vesselRepository };
