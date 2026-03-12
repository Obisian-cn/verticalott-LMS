import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { unauthorized, forbidden } from "./errors";

export interface AuthPayload extends JwtPayload {
  sub: string;
  role: "student" | "instructor" | "admin";
}

declare global {
  namespace Express {
    interface Request {
      user?: AuthPayload;
    }
  }
}

export const authenticate =
  (options: { required?: boolean } = { required: true }) =>
  (req: Request, _res: Response, next: NextFunction) => {
    const header = req.headers.authorization;
    if (!header) {
      if (options.required) return next(unauthorized("Missing Authorization header"));
      return next();
    }

    const [, token] = header.split(" ");
    if (!token) {
      if (options.required) return next(unauthorized("Invalid Authorization header"));
      return next();
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || "changeme") as AuthPayload;
      req.user = decoded;
      next();
    } catch {
      if (options.required) return next(unauthorized("Invalid or expired token"));
      next();
    }
  };

export const authorize =
  (roles: Array<"student" | "instructor" | "admin">) =>
  (req: Request, _res: Response, next: NextFunction) => {
    if (!req.user) return next(unauthorized());
    if (!roles.includes(req.user.role)) {
      return next(forbidden("Insufficient permissions"));
    }
    next();
  };

