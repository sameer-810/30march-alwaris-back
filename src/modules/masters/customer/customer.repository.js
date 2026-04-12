import { CustomerModel } from "./customer.model.js";
import { CounterModel } from "../../common/shared-crud/counter.model.js";
import {
  escapeRegex,
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
} from "../../common/shared-crud/resourceRepositoryHelpers.js";

async function getNextCustomerCode() {
  const counter = await CounterModel.findByIdAndUpdate(
    "customerCode",
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  return counter.seq;
}

const customerRepository = {
  findById(id) {
    return findActiveById(CustomerModel, id, {
      path: "customerTypeId",
      select: "customerType",
    });
  },

  async createWithAutoCode(data) {
    const code = await getNextCustomerCode();
    return CustomerModel.create({ ...data, code });
  },

  async findMany({ search, customerTypeId, page, limit, sortBy, sortDir }) {
    const q = { isDeleted: false };
    if (customerTypeId) q.customerTypeId = customerTypeId;

    if (search) {
      const safeSearch = escapeRegex(search);
      const asNumber = Number(search);
      const hasNumber =
        !Number.isNaN(asNumber) && String(asNumber) === String(search).trim();

      q.$or = [
        { customerName: { $regex: safeSearch, $options: "i" } },
        { emailId: { $regex: safeSearch, $options: "i" } },
        { city: { $regex: safeSearch, $options: "i" } },
        { state: { $regex: safeSearch, $options: "i" } },
        { contactPerson: { $regex: safeSearch, $options: "i" } },
        { contactNo: { $regex: safeSearch, $options: "i" } },
      ];

      if (hasNumber) {
        q.$or.push({ code: asNumber });
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
