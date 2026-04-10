const { ShipmentModel } = require("./shipment.model");
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
  model: ShipmentModel,
  counterModel: CounterModel,
  counterId: "shipmentCounterCode",
  fieldName: "code",
});

const shipmentRepository = {
  async createWithAutoCode(data) {
    return codeHelpers.createWithAutoValue(data);
  },

  findById(id) {
    return findActiveById(ShipmentModel, id);
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    await codeHelpers.ensureLegacyValues();

    const q = { isDeleted: false };

    if (search) {
      const safeSearch = escapeRegex(search);
      q.shipmentType = { $regex: safeSearch, $options: "i" };
    }

    return runPagedQuery({
      model: ShipmentModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(ShipmentModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(ShipmentModel, id);
  },
};

module.exports = { shipmentRepository };
