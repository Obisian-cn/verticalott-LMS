import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { ok } from "../utils/response";
import { AuthRequest } from "../middlewares/auth";
import { AppError } from "../utils/AppError";

export class AuthController {
  private authService = new AuthService();

  public registerDeprecated = async (req: Request, res: Response, next: NextFunction) => {
    try {
      throw new AppError("Manual registration is deprecated. Please use phone OTP login.", 400);
    } catch (err) {
      next(err);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { token } = req.body;
      if (!token) throw new AppError("Firebase token is required", 400);
      
      const data = await this.authService.login(token);
      return ok(res, data, "Login successful");
    } catch (err) {
      next(err);
    }
  };

  public refresh = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { refreshToken } = req.body;
      const data = await this.authService.refresh(refreshToken);
      return ok(res, data, "Token refreshed successfully");
    } catch (err) {
      next(err);
    }
  };

  public logout = async (req: Request, res: Response, next: NextFunction) => {
    try {
      return ok(res, null, "Logout successful");
    } catch (err) {
      next(err);
    }
  };

  public me = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      return ok(res, { user: req.user }, "Current user details");
    } catch (err) {
      next(err);
    }
  };
}
