import { Request, Response, NextFunction } from "express";
import { UserService } from "../services/user.service";
import { ok } from "../utils/response";
import { AuthRequest } from "../middlewares/auth";
import { AppError } from "../utils/AppError";

export class UserController {
  private userService = new UserService();

  public getUsers = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const users = await this.userService.getUsers();
      return ok(res, users, "Users retrieved successfully");
    } catch (err) {
      next(err);
    }
  };

  public getUserById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const user = await this.userService.getUserById(req.params.id);
      return ok(res, user, "User retrieved successfully");
    } catch (err) {
      next(err);
    }
  };

  public updateUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== "admin" && req.user?.id !== req.params.id) {
        throw new AppError("Forbidden: Can only update your own profile", 403);
      }
      
      const user = await this.userService.updateUser(req.params.id, req.body);
      return ok(res, user, "User updated successfully");
    } catch (err) {
      next(err);
    }
  };

  public deleteUser = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user?.role !== "admin" && req.user?.id !== req.params.id) {
        throw new AppError("Forbidden: Can only delete your own profile", 403);
      }

      await this.userService.deleteUser(req.params.id);
      return ok(res, null, "User deleted successfully");
    } catch (err) {
      next(err);
    }
  };
}
