const bcrypt = require("bcryptjs");
const { AppError } = require("../../utils/AppError");
const { userRepository } = require("./user.repository");

const userService = {
  async createUser({ name, email, role, password, isActive }) {
    const existing = await userRepository.findByEmail(email);
    if (existing) throw new AppError("Email already exists", 409);

    const passwordHash = await bcrypt.hash(password, 12);
    const created = await userRepository.create({
      name,
      email: String(email).toLowerCase(),
      role,
      passwordHash,
      isActive: typeof isActive === "boolean" ? isActive : true,
    });
    return created;
  },

  listUsers({ search, role, isActive, page, limit }) {
    return userRepository.findMany({ search, role, isActive, page, limit });
  },

  async updateUser(id, patch) {
    const updated = await userRepository.updateById(id, patch);
    if (!updated) throw new AppError("User not found", 404);
    return updated;
  },

  async resetPassword(id, password) {
    const passwordHash = await bcrypt.hash(password, 12);
    const updated = await userRepository.updateById(id, { passwordHash });
    if (!updated) throw new AppError("User not found", 404);
    return updated;
  },

  async deleteUser(id) {
    const deleted = await userRepository.softDeleteById(id);
    if (!deleted) throw new AppError("User not found", 404);
    return deleted;
  },
};

module.exports = { userService };
