import { TermsModel } from "./terms.model.js";
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
  model: TermsModel,
  counterModel: CounterModel,
  counterId: "termsCounterCode",
  fieldName: "code",
});

const termsRepository = {
  async createWithAutoCode(data) {
    return codeHelpers.createWithAutoValue(data);
  },

  findById(id) {
    return findActiveById(TermsModel, id);
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    const q = { isDeleted: false };

    if (search) {
      const safeSearch = escapeRegex(search);
      q.$or = [
        { terms: { $regex: safeSearch, $options: "i" } },
        { description: { $regex: safeSearch, $options: "i" } },
      ];
    }

    return runPagedQuery({
      model: TermsModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(TermsModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(TermsModel, id);
  },
};

export { termsRepository };
