import { CustomerModel } from "./customer.model.js";
import { CounterModel } from "../../common/shared-crud/counter.model.js";
import {
  createCounterFieldHelpers,
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
} from "../../common/shared-crud/resourceRepositoryHelpers.js";

const counterHelpers = createCounterFieldHelpers({
  model: CustomerModel,
  counterModel: CounterModel,
  counterId: "customerCode",
  fieldName: "code",
});

const customerRepository = {
  findById(id) {
    return findActiveById(CustomerModel, id, {
      path: "customerTypeId",
      select: "customerType",
    });
  },

  async createWithAutoCode(data) {
    return counterHelpers.createWithAutoValue(data);
  },

  async findMany({ search, customerTypeId, page, limit, sortBy, sortDir }) {
    const q = { isDeleted: false };
    if (customerTypeId) q.customerTypeId = customerTypeId;

    if (search) {
      const asNumber = Number(search);
      const hasNumber =
        !Number.isNaN(asNumber) && String(asNumber) === String(search).trim();

      if (hasNumber) {
        q.$or = [{ $text: { $search: search } }, { code: asNumber }];
      } else {
        q.$text = { $search: search };
      }
    }

    return runPagedQuery({
      model: CustomerModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
      populate: { path: "customerTypeId", select: "customerType" },
    });
  },

  updateById(id, patch) {
    return updateActiveById(CustomerModel, id, patch, {
      path: "customerTypeId",
      select: "customerType",
    });
  },

  softDeleteById(id) {
    return softDeleteActiveById(CustomerModel, id);
  },
};

export { customerRepository };
