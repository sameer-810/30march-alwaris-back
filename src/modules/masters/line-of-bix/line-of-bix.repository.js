import { LineOfBixModel } from "./line-of-bix.model.js";
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
  model: LineOfBixModel,
  counterModel: CounterModel,
  counterId: "lineOfBixCounter",
  fieldName: "counter",
});

const lineOfBixRepository = {
  async createWithAutoCounter(data) {
    return counterHelpers.createWithAutoValue(data);
  },

  findById(id) {
    return findActiveById(LineOfBixModel, id);
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    const q = { isDeleted: false };

    if (search) {
      const safeSearch = escapeRegex(search);
      q.$or = [
        { code: { $regex: safeSearch, $options: "i" } },
        { lineOfBix: { $regex: safeSearch, $options: "i" } },
      ];
    }

    return runPagedQuery({
      model: LineOfBixModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(LineOfBixModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(LineOfBixModel, id);
  },
};

export { lineOfBixRepository };
