const { TermsConditionModel } = require("./terms-condition.model");
const {
  TermsConditionCounterModel,
} = require("./terms-condition.counter.model");
const { LineOfBixModel } = require("../line-of-bix/line-of-bix.model");
const {
  createCounterFieldHelpers,
  escapeRegex,
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
} = require("../shared/masterRepositoryHelpers");

const counterHelpers = createCounterFieldHelpers({
  model: TermsConditionModel,
  counterModel: TermsConditionCounterModel,
  counterId: "termsConditionCounter",
  fieldName: "counter",
});

const termsConditionRepository = {
  async createWithAutoCounter(data) {
    return counterHelpers.createWithAutoValue(data);
  },

  findById(id) {
    return findActiveById(TermsConditionModel, id, {
      path: "lineOfBixId",
      select: "code lineOfBix",
    });
  },

  async lineOfBixExists(id) {
    const row = await LineOfBixModel.findOne({ _id: id, isDeleted: false })
      .select("_id")
      .lean();
    return Boolean(row);
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    await counterHelpers.ensureLegacyValues();

    const q = { isDeleted: false };

    if (search) {
      const safeSearch = escapeRegex(search);
      const lineMatches = await LineOfBixModel.find({
        isDeleted: false,
        $or: [
          { code: { $regex: safeSearch, $options: "i" } },
          { lineOfBix: { $regex: safeSearch, $options: "i" } },
        ],
      })
        .select("_id")
        .lean();

      const lineIds = lineMatches.map((r) => r._id);
      q.$or = [{ description: { $regex: safeSearch, $options: "i" } }];
      if (lineIds.length > 0) {
        q.$or.push({ lineOfBixId: { $in: lineIds } });
      }
    }

    return runPagedQuery({
      model: TermsConditionModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
      populate: { path: "lineOfBixId", select: "code lineOfBix" },
    });
  },

  updateById(id, patch) {
    return updateActiveById(TermsConditionModel, id, patch, {
      path: "lineOfBixId",
      select: "code lineOfBix",
    });
  },

  softDeleteById(id) {
    return softDeleteActiveById(TermsConditionModel, id);
  },
};

module.exports = { termsConditionRepository };
