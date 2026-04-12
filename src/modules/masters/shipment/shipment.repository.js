import { ShipmentModel } from "./shipment.model.js";
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

export { shipmentRepository };
