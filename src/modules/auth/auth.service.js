import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { env } from "../../config/env.js";
import { AppError } from "../../utils/AppError.js";
import { userRepository } from "../user/user.repository.js";

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

export { authService };
