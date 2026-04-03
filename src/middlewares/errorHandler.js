const { AppError } = require("../utils/AppError");

const STATUS_CODE_TO_ERROR_CODE = {
  400: "BAD_REQUEST",
  401: "UNAUTHORIZED",
  403: "FORBIDDEN",
  404: "NOT_FOUND",
  409: "CONFLICT",
  422: "UNPROCESSABLE_ENTITY",
  429: "TOO_MANY_REQUESTS",
  500: "INTERNAL_SERVER_ERROR",
};

function getErrorCode(statusCode, err, isAppError) {
  if (isAppError && typeof err.code === "string" && err.code.length > 0) {
    return err.code;
  }
  return STATUS_CODE_TO_ERROR_CODE[statusCode] || "UNKNOWN_ERROR";
}

function errorHandler(err, _req, res, _next) {
  const isAppError = err instanceof AppError;
  const statusCode = isAppError ? err.statusCode : 500;
  const message = isAppError ? err.message : "Internal server error";
  const details = isAppError ? err.details : undefined;
  const code = getErrorCode(statusCode, err, isAppError);

  if (process.env.NODE_ENV !== "production") {
    console.error(err);
  }

  res.status(statusCode).json({
    success: false,
    error: {
      code,
      message,
      details,
    },
    message,
    details,
  });
}

module.exports = { errorHandler };
