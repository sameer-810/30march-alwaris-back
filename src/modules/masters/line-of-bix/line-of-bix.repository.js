const { LineOfBixModel } = require("./line-of-bix.model");
const { LineOfBixCounterModel } = require("./line-of-bix.counter.model");
const {
  createCounterFieldHelpers,
  escapeRegex,
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
} = require("../shared/masterRepositoryHelpers");

const counterHelpers = createCounterFieldHelpers({
  model: LineOfBixModel,
  counterModel: LineOfBixCounterModel,
  counterId: "lineOfBixCounter",
  fieldName: "counter",
});

const lineOfBixRepository = {
  async createWithAutoCounter(data) {
    return counterHelpers.createWithAutoValue(data);
  },

  findById(id) {
    return findActiveById(LineOfBixModel, id);
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    await counterHelpers.ensureLegacyValues();

    const q = { isDeleted: false };

    if (search) {
      const safeSearch = escapeRegex(search);
      q.$or = [
        { code: { $regex: safeSearch, $options: "i" } },
        { lineOfBix: { $regex: safeSearch, $options: "i" } },
      ];
    }

    return runPagedQuery({
      model: LineOfBixModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(LineOfBixModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(LineOfBixModel, id);
  },
};

module.exports = { lineOfBixRepository };
