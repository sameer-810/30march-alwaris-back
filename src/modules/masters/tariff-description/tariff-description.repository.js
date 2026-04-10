const { TariffDescriptionModel } = require("./tariff-description.model");
const { CounterModel } = require("../../common/shared-crud/counter.model");
const {
  createCounterFieldHelpers,
  escapeRegex,
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
} = require("../../common/shared-crud/resourceRepositoryHelpers");

const counterHelpers = createCounterFieldHelpers({
  model: TariffDescriptionModel,
  counterModel: CounterModel,
  counterId: "tariffDescriptionCounter",
  fieldName: "counter",
});

const tariffDescriptionRepository = {
  async createWithAutoCounter(data) {
    return counterHelpers.createWithAutoValue(data);
  },

  findById(id) {
    return findActiveById(TariffDescriptionModel, id);
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    await counterHelpers.ensureLegacyValues();

    const q = { isDeleted: false };

    if (search) {
      const safeSearch = escapeRegex(search);
      q.description = { $regex: safeSearch, $options: "i" };
    }

    return runPagedQuery({
      model: TariffDescriptionModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(TariffDescriptionModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(TariffDescriptionModel, id);
  },
};

module.exports = { tariffDescriptionRepository };
