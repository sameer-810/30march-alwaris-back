import { ServiceModel } from "./service.model.js";
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
  model: ServiceModel,
  counterModel: CounterModel,
  counterId: "serviceCounterCode",
  fieldName: "code",
});

const serviceRepository = {
  async createWithAutoCode(data) {
    return codeHelpers.createWithAutoValue(data);
  },

  findById(id) {
    return findActiveById(ServiceModel, id);
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    const q = { isDeleted: false };

    if (search) {
      const safeSearch = escapeRegex(search);
      q.serviceType = { $regex: safeSearch, $options: "i" };
    }

    return runPagedQuery({
      model: ServiceModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(ServiceModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(ServiceModel, id);
  },
};

export { serviceRepository };
