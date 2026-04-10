const { VendorTypeModel } = require("./vendor-type.model");
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
  model: VendorTypeModel,
  counterModel: CounterModel,
  counterId: "vendorTypeCode",
  fieldName: "code",
});

const vendorTypeRepository = {
  async createWithAutoCode(data) {
    return codeHelpers.createWithAutoValue(data);
  },

  findById(id) {
    return findActiveById(VendorTypeModel, id);
  },

  findByName(vendorType) {
    return VendorTypeModel.findOne({ vendorType, isDeleted: false }).lean();
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    await codeHelpers.ensureLegacyValues();

    const q = { isDeleted: false };

    if (search) {
      const safeSearch = escapeRegex(search);
      q.vendorType = { $regex: safeSearch, $options: "i" };
    }

    return runPagedQuery({
      model: VendorTypeModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(VendorTypeModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(VendorTypeModel, id);
  },
};

module.exports = { vendorTypeRepository };
