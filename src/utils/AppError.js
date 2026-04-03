class AppError extends Error {
  constructor(message, statusCode, details, code) {
    super(message);
    this.name = "AppError";
    this.statusCode = statusCode || 500;

    if (typeof details === "string" && typeof code === "undefined") {
      this.code = details;
      this.details = undefined;
    } else {
      this.details = details;
      this.code = code;
    }
  }
}

module.exports = { AppError };
