import { AppError } from "../utils/AppError.js";

function validateRequest(schema) {
  return (req, _res, next) => {
    const result = schema.safeParse({
      body: req.body ?? {},
      params: req.params ?? {},
      query: req.query ?? {},
    });

    if (!result.success) {
      return next(
        new AppError("Validation error", 400, {
          issues: result.error.issues.map((i) => ({
            path: i.path,
            message: i.message,
          })),
        }),
      );
    }

    req.validated = result.data;
    next();
  };
}

export { validateRequest };
