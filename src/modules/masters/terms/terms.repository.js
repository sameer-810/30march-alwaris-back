const { TermsModel } = require("./terms.model");
const { TermsCounterModel } = require("./terms.counter.model");
const {
  createCounterFieldHelpers,
  escapeRegex,
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
} = require("../shared/masterRepositoryHelpers");

const codeHelpers = createCounterFieldHelpers({
  model: TermsModel,
  counterModel: TermsCounterModel,
  counterId: "termsCounterCode",
  fieldName: "code",
});

const termsRepository = {
  async createWithAutoCode(data) {
    return codeHelpers.createWithAutoValue(data);
  },

  findById(id) {
    return findActiveById(TermsModel, id);
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    await codeHelpers.ensureLegacyValues();

    const q = { isDeleted: false };

    if (search) {
      const safeSearch = escapeRegex(search);
      q.$or = [
        { terms: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
      ];
    }

    return runPagedQuery({
      model: TermsModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(TermsModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(TermsModel, id);
  },
};

module.exports = { termsRepository };
