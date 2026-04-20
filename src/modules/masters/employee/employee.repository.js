import { EmployeeModel } from "./employee.model.js";
import { CounterModel } from "../../common/shared-crud/counter.model.js";
import {
  escapeRegex,
  findActiveById,
  runPagedQuery,
  softDeleteActiveById,
  updateActiveById,
} from "../../common/shared-crud/resourceRepositoryHelpers.js";

async function getNextEmployeeId() {
  const counter = await CounterModel.findByIdAndUpdate(
    "employeeId",
    { $inc: { seq: 1 } },
    { upsert: true, new: true, setDefaultsOnInsert: true },
  ).lean();
  const next = counter.seq;
  return `EMP${String(next).padStart(6, "0")}`;
}

const employeeRepository = {
  create(data) {
    return EmployeeModel.create(data);
  },

  findById(id) {
    return findActiveById(EmployeeModel, id);
  },

  async createWithAutoId(data) {
    const employeeId = await getNextEmployeeId();
    return EmployeeModel.create({ ...data, employeeId });
  },

  async findMany({
    search,
    department,
    isActive,
    isApproved,
    page,
    limit,
    sortBy,
    sortDir,
  }) {
    const q = { isDeleted: false };
    if (department) q.department = department;
    if (typeof isActive === "boolean") q.isActive = isActive;
    if (typeof isApproved === "boolean") q.isApproved = isApproved;

    if (search) {
      const safeSearch = escapeRegex(search);
      q.$or = [
        { employeeId: { $regex: safeSearch, $options: "i" } },
        { employeeName: { $regex: safeSearch, $options: "i" } },
        { emailId: { $regex: safeSearch, $options: "i" } },
        { city: { $regex: safeSearch, $options: "i" } },
        { state: { $regex: safeSearch, $options: "i" } },
      ];
    }

    return runPagedQuery({
      model: EmployeeModel,
      query: q,
      page,
      limit,
      sortBy,
      sortDir,
    });
  },

  updateById(id, patch) {
    return updateActiveById(EmployeeModel, id, patch);
  },

  softDeleteById(id) {
    return softDeleteActiveById(EmployeeModel, id, { isActive: false });
  },
};

export { employeeRepository };
