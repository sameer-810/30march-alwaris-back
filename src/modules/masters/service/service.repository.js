const { ServiceModel } = require("./service.model");
const { ServiceCounterModel } = require("./service.counter.model");
const {
  createCounterFieldHelpers,
  escapeRegex,
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
} = require("../shared/masterRepositoryHelpers");

const codeHelpers = createCounterFieldHelpers({
  model: ServiceModel,
  counterModel: ServiceCounterModel,
  counterId: "serviceCounterCode",
  fieldName: "code",
});

const serviceRepository = {
  async createWithAutoCode(data) {
    return codeHelpers.createWithAutoValue(data);
  },

  findById(id) {
    return findActiveById(ServiceModel, id);
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    await codeHelpers.ensureLegacyValues();

    const q = { isDeleted: false };

    if (search) {
      const safeSearch = escapeRegex(search);
      q.serviceType = { $regex: safeSearch, $options: "i" };
    }

    return runPagedQuery({
      model: ServiceModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(ServiceModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(ServiceModel, id);
  },
};

module.exports = { serviceRepository };
