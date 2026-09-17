// Centralized error handler. Any error thrown (or passed via next(err)) in a
// controller ends up here, so route handlers can stay free of try/catch
// boilerplate for error responses.
export function errorHandler(err, req, res, next) {
  const statusCode = err.isAppError ? err.statusCode : 500;
  const message = err.isAppError ? err.message : "Internal server error";

  if (!err.isAppError) {
    console.error("Unexpected error:", err);
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}

export function notFoundHandler(req, res) {
  res.status(404).json({
    success: false,
    error: "Resource not found",
  });
}
