import { CustomerTypeModel } from "./customer-type.model.js";
import { CounterModel } from "../../common/shared-crud/counter.model.js";
import {
  createCounterFieldHelpers,
  escapeRegex,
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
} from "../../common/shared-crud/resourceRepositoryHelpers.js";

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

export { customerTypeRepository };
