function notFoundHandler(req, res, _next) {
  const message = "Route not found";

  res.status(404).json({
    success: false,
    error: {
      code: "NOT_FOUND",
      message,
      details: {
        path: req.originalUrl,
      },
    },
    message,
    path: req.originalUrl,
  });
}

export { notFoundHandler };
