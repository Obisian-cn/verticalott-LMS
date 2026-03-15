import { Request, Response, NextFunction } from "express";
import { VideoService } from "../services/video.service";
import { created, ok } from "../utils/response";
import { AuthRequest } from "../middlewares/auth";

export class VideoController {
  private videoService = new VideoService();

  public uploadVideo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const video = await this.videoService.uploadVideo(
        req.body,
        req.user!.id,
        req.user!.role
      );
      return created(res, video, "Video uploaded successfully");
    } catch (err) {
      next(err);
    }
  };

  public getVideoById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const video = await this.videoService.getVideoById(req.params.id);
      return ok(res, video, "Video retrieved successfully");
    } catch (err) {
      next(err);
    }
  };

  public deleteVideo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.videoService.deleteVideo(
        req.params.id,
        req.user!.id,
        req.user!.role
      );
      return ok(res, null, "Video deleted successfully");
    } catch (err) {
      next(err);
    }
  };
}
