import { Request, Response, NextFunction } from "express";
import { VideoService } from "./video.service";
import { created, ok } from "../../utils/response";
import { AuthRequest } from "../../middlewares/auth";
import { AppError } from "../../utils/AppError";
import fs from "fs";

export class VideoController {
  private videoService = new VideoService();

  public uploadVideo = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { title, description } = req.body;
      const file = req.file;

      if (!file) {
        throw new AppError("Video file is required", 400);
      }
      
      if (!title) {
        try { fs.unlinkSync(file.path) } catch (e) {}
        throw new AppError("Title is required", 400);
      }

      const videoResponse = await this.videoService.uploadVideo(
        file.path,
        { title, description },
        req.user!.id
      );

      return created(res, videoResponse, "Video uploaded successfully");
    } catch (err) {
      next(err);
    }
  };

  public getVideos = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const videos = await this.videoService.getVideos(req.user!.id, req.user!.role);
      return ok(res, videos, "Videos retrieved successfully");
    } catch (err) {
      next(err);
    }
  };

  public getVideoById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const video = await this.videoService.getVideoById(req.params.id);
      return ok(res, video, "Video retrieved successfully");
    } catch (err) {
      next(err);
    }
  };
}
