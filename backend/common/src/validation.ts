import { Request, Response, NextFunction } from "express";
import { validationResult, ValidationChain } from "express-validator";
import { badRequest } from "./errors";

export const validate =
  (chains: ValidationChain[]) =>
  async (req: Request, _res: Response, next: NextFunction) => {
    await Promise.all(chains.map((chain) => chain.run(req)));
    const result = validationResult(req);
    if (!result.isEmpty()) {
      return next(badRequest("Validation error", result.array()));
    }
    next();
  };

