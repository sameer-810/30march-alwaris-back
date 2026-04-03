const { PortModel } = require("./port.model");
const { PortCounterModel } = require("./port.counter.model");
const {
  createCounterFieldHelpers,
  escapeRegex,
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
} = require("../shared/masterRepositoryHelpers");

const codeHelpers = createCounterFieldHelpers({
  model: PortModel,
  counterModel: PortCounterModel,
  counterId: "portCounterCode",
  fieldName: "code",
});

const portRepository = {
  async createWithAutoCode(data) {
    return codeHelpers.createWithAutoValue(data);
  },

  findById(id) {
    return findActiveById(PortModel, id);
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    await codeHelpers.ensureLegacyValues();

    const q = { isDeleted: false };

    if (search) {
      const safeSearch = escapeRegex(search);
      q.$or = [
        { portCode: { $regex: safeSearch, $options: "i" } },
        { portName: { $regex: safeSearch, $options: "i" } },
      ];
    }

    return runPagedQuery({
      model: PortModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(PortModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(PortModel, id);
  },
};

module.exports = { portRepository };
