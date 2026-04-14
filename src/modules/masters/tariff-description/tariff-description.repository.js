import { TariffDescriptionModel } from "./tariff-description.model.js";
import { CounterModel } from "../../common/shared-crud/counter.model.js";
import {
  createCounterFieldHelpers,
  escapeRegex,
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
} from "../../common/shared-crud/resourceRepositoryHelpers.js";

const counterHelpers = createCounterFieldHelpers({
  model: TariffDescriptionModel,
  counterModel: CounterModel,
  counterId: "tariffDescriptionCounter",
  fieldName: "counter",
});

const tariffDescriptionRepository = {
  async createWithAutoCounter(data) {
    return counterHelpers.createWithAutoValue(data);
  },

  findById(id) {
    return findActiveById(TariffDescriptionModel, id);
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    const q = { isDeleted: false };

    if (search) {
      const safeSearch = escapeRegex(search);
      q.description = { $regex: safeSearch, $options: "i" };
    }

    return runPagedQuery({
      model: TariffDescriptionModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(TariffDescriptionModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(TariffDescriptionModel, id);
  },
};

export { tariffDescriptionRepository };
