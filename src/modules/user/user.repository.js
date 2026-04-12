import { UserModel } from "./user.model.js";
import { escapeRegex } from "../common/shared-crud/resourceRepositoryHelpers.js";

const userRepository = {
  create(data) {
    return UserModel.create(data);
  },

  findById(id) {
    return UserModel.findById(id).lean(false);
  },

  findByEmail(email) {
    return UserModel.findOne({
      email: String(email).toLowerCase(),
      isDeleted: false,
    }).lean(false);
  },

  findMany({ search, role, isActive, page, limit }) {
    const q = { isDeleted: false };
    if (role) q.role = role;
    if (typeof isActive === "boolean") q.isActive = isActive;
    if (search) {
      const safeSearch = escapeRegex(search);
      q.$or = [
        { name: { $regex: safeSearch, $options: "i" } },
        { email: { $regex: safeSearch, $options: "i" } },
      ];
    }

    const skip = (page - 1) * limit;
    return Promise.all([
      UserModel.find(q).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
      UserModel.countDocuments(q),
    ]).then(([items, total]) => {
      const totalPages = Math.ceil(total / limit);
      const hasNextPage = page < totalPages;
      const hasPrevPage = page > 1;
      return {
        items,
        total,
        totalPages,
        page,
        limit,
        hasNextPage,
        hasPrevPage,
      };
    });
  },

  updateById(id, patch) {
    return UserModel.findOneAndUpdate({ _id: id, isDeleted: false }, patch, {
      new: true,
    }).lean();
  },

  softDeleteById(id) {
    return UserModel.findOneAndUpdate(
      { _id: id, isDeleted: false },
      { isDeleted: true, isActive: false, deletedAt: new Date() },
      { new: true },
    ).lean();
  },
};

export { userRepository };
