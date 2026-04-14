import { AppError } from "../utils/AppError.js";

function notFoundHandler(req, _res, next) {
  next(
    new AppError(`Route not found: ${req.originalUrl}`, 404, {
      code: "NOT_FOUND",
      details: { path: req.originalUrl },
    }),
  );
}

export { notFoundHandler };
