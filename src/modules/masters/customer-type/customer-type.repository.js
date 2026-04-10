const { CustomerTypeModel } = require("./customer-type.model");
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
  model: CustomerTypeModel,
  counterModel: CounterModel,
  counterId: "customerTypeCode",
  fieldName: "code",
});

const customerTypeRepository = {
  async createWithAutoCode(data) {
    return codeHelpers.createWithAutoValue(data);
  },

  findById(id) {
    return findActiveById(CustomerTypeModel, id);
  },

  findByName(customerType) {
    return CustomerTypeModel.findOne({ customerType, isDeleted: false }).lean();
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    await codeHelpers.ensureLegacyValues();

    const q = { isDeleted: false };

    if (search) {
      const safeSearch = escapeRegex(search);
      q.customerType = { $regex: safeSearch, $options: "i" };
    }

    return runPagedQuery({
      model: CustomerTypeModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(CustomerTypeModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(CustomerTypeModel, id);
  },
};

module.exports = { customerTypeRepository };
