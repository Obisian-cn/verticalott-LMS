import { Request, Response, NextFunction } from "express";
import Joi from "joi";
import { AppError } from "../utils/AppError";

export const validate = (schema: Joi.ObjectSchema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body, { abortEarly: false });
    if (error) {
      const details = error.details.map((details) => details.message);
      return next(new AppError("Validation error", 400, details));
    }
    next();
  };
};
