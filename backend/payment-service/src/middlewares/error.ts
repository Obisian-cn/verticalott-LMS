import { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/AppError";
import { fail } from "../utils/response";
import { logger } from "../utils/logger";

export const errorHandler = (err: Error, req: Request, res: Response, next: NextFunction) => {
  if (err instanceof AppError) {
    logger.warn(err.message, { statusCode: err.statusCode, details: err.details });
    return fail(res, err.statusCode, err.message, err.details);
  }
  
  logger.error("Unhandled error", { error: err.stack });
  return fail(res, 500, "Internal server error");
};
