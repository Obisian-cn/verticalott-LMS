import { Request, Response, NextFunction } from "express";
import { ProgressService } from "../services/progress.service";
import { created, ok } from "../utils/response";
import { AuthRequest } from "../middlewares/auth";

export class ProgressController {
  private progressService = new ProgressService();

  public trackProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const progress = await this.progressService.trackProgress(req.user!.id, req.body);
      return ok(res, progress, "Progress updated successfully");
    } catch (err) {
      next(err);
    }
  };

  public getCourseProgress = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const progress = await this.progressService.getCourseProgress(
        req.user!.id,
        req.params.id
      );
      return ok(res, progress, "Progress retrieved successfully");
    } catch (err) {
      next(err);
    }
  };
}
