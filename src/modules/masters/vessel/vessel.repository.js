import { VesselModel } from "./vessel.model.js";
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
  model: VesselModel,
  counterModel: CounterModel,
  counterId: "vesselCode",
  fieldName: "code",
});

const vesselRepository = {
  async createWithAutoCode(data) {
    return codeHelpers.createWithAutoValue(data);
  },

  findById(id) {
    return findActiveById(VesselModel, id);
  },

  findByName(vesselName) {
    return VesselModel.findOne({ vesselName, isDeleted: false }).lean();
  },

  async findMany({ search, page, limit, sortBy, sortDir }) {
    await codeHelpers.ensureLegacyValues();

    const q = { isDeleted: false };

    if (search) {
      const safeSearch = escapeRegex(search);
      q.vesselName = { $regex: safeSearch, $options: "i" };
    }

    return runPagedQuery({
      model: VesselModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(VesselModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(VesselModel, id);
  },
};

export { vesselRepository };
