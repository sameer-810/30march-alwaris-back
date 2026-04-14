import { VendorTypeModel } from "./vendor-type.model.js";
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

export { vendorTypeRepository };
