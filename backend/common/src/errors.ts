export class AppError extends Error {
  public statusCode: number;
  public isOperational: boolean;
  public details?: unknown;

  constructor(message: string, statusCode = 500, details?: unknown, isOperational = true) {
    super(message);
    this.statusCode = statusCode;
    this.isOperational = isOperational;
    this.details = details;
    Object.setPrototypeOf(this, new.target.prototype);
    Error.captureStackTrace(this, this.constructor);
  }
}

export const notFound = (message = "Resource not found") =>
  new AppError(message, 404);

export const badRequest = (message = "Bad request", details?: unknown) =>
  new AppError(message, 400, details);

export const unauthorized = (message = "Unauthorized") =>
  new AppError(message, 401);

export const forbidden = (message = "Forbidden") =>
  new AppError(message, 403);

export const conflict = (message = "Conflict") =>
  new AppError(message, 409);

