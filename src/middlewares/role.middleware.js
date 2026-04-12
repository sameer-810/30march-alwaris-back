import { AppError } from "../utils/AppError.js";

function authorizeRoles(...roles) {
  return (req, _res, next) => {
    if (!req.user) return next(new AppError("Unauthorized", 401));
    if (!roles.includes(req.user.role))
      return next(new AppError("Forbidden", 403));
    next();
  };
}

export { authorizeRoles };
