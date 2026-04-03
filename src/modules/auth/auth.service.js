const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { env } = require("../../config/env");
const { AppError } = require("../../utils/AppError");
const { userRepository } = require("../user/user.repository");

const authService = {
  async login({ email, password }) {
    const user = await userRepository.findByEmail(email);
    if (!user) throw new AppError("Invalid credentials", 401);
    if (user.isDeleted) throw new AppError("Invalid credentials", 401);
    if (!user.isActive) throw new AppError("Account disabled", 403);

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) throw new AppError("Invalid credentials", 401);

    const accessToken = jwt.sign(
      { sub: String(user._id), role: user.role },
      env.JWT_ACCESS_SECRET,
      { expiresIn: env.JWT_ACCESS_EXPIRES_IN },
    );

    return {
      accessToken,
      user: {
        id: String(user._id),
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  },
};

module.exports = { authService };
