const { UserModel } = require("./user.model");
const {
  escapeRegex,
} = require("../common/shared-crud/resourceRepositoryHelpers");

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
    ]).then(([items, total]) => ({ items, total }));
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

module.exports = { userRepository };
