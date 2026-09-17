// Small custom error class so services can throw errors with an explicit
// HTTP status code, which the centralized error handler then reads.
export class AppError extends Error {
  constructor(message, statusCode = 500) {
    super(message);
    this.statusCode = statusCode;
    this.isAppError = true;
  }
}
