const jwt = require("jsonwebtoken");
const { env } = require("../config/env");
const { AppError } = require("../utils/AppError");
const { logger } = require("../config/logger");
const { userRepository } = require("../modules/user/user.repository");

async function authenticate(req, _res, next) {
  try {
    const authHeader = req.headers.authorization || "";
    const [, token] = authHeader.split(" ");

    if (!token) return next(new AppError("Unauthorized", 401));

    const payload = jwt.verify(token, env.JWT_ACCESS_SECRET);
    const user = await userRepository.findById(payload.sub);
    if (!user || user.isDeleted) return next(new AppError("Unauthorized", 401));
    if (!user.isActive) return next(new AppError("Account disabled", 403));

    req.user = {
      id: String(user._id),
      role: user.role,
      email: user.email,
      name: user.name,
    };
    next();
  } catch (err) {
    if (env.NODE_ENV !== "production") {
      logger.debug(err, "Authentication error");
    }
    next(new AppError("Unauthorized", 401));
  }
}

module.exports = { authenticate };
