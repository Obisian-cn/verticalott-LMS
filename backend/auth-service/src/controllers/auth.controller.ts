import { Request, Response, NextFunction } from "express";
import { AuthService } from "../services/auth.service";
import { created, ok, sendResponse } from "../utils/response";
import { AuthRequest } from "../middlewares/auth";

export class AuthController {
  private authService = new AuthService();

  public register = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { name, email, password, role } = req.body;
      const data = await this.authService.register(name, email, password, role);
      return created(res, data, "User registered successfully");
    } catch (err) {
      next(err);
    }
  };

  public login = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, password } = req.body;
      const data = await this.authService.login(email, password);
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
      // Typically, JWT invalidation happens client-side or with a blacklist.
      // For this implementation, we just return a success response.
      return ok(res, null, "Logout successful");
    } catch (err) {
      next(err);
    }
  };

  public me = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      // req.user is set by auth middleware
      return ok(res, { user: req.user }, "Current user details");
    } catch (err) {
      next(err);
    }
  };
}
