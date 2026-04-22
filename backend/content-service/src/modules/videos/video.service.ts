import { Video } from "../../models";
import { AppError } from "../../utils/AppError";
import { muxService } from "../../services/mux.service";
import fs from "fs";
import { logger } from "../../utils/logger";

export class VideoService {
  public async uploadVideo(
    filePath: string,
    data: { title: string; description?: string },
    instructorId: string
  ): Promise<any> {
    try {
      if (!filePath) {
        throw new AppError("Video file is required", 400);
      }

      let videoPlaybackId = null;
      let videoUrl = null;

      // 1) Stream upload to Mux
      try {
        console.log("Uploading video to Mux------->");
        const { playbackId, assetId } = await muxService.uploadVideo(filePath);
        videoPlaybackId = playbackId;
        videoUrl = muxService.getPlaybackUrl(playbackId);
      } catch (err: any) {
        throw new AppError("Video upload failed: " + err.message, 500);
      } finally {
        // Remove temp file from disk immediately
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (cleanupErr) {
          logger.warn("Failed to clean up temp file", { error: cleanupErr });
        }
      }

      // 2) Store video in DB
      const video = await Video.create({
        title: data.title,
        description: data.description || "",
        playbackId: videoPlaybackId,
        videoUrl: videoUrl,
        instructorId: instructorId,
        duration: 0 // Duration could be fetched via webhooks later
      });

      return video;
    } catch (error: any) {
      console.error("DB Query Error in uploadVideo:", error);
      if (error instanceof AppError) throw error;
      throw new AppError(`Database error uploading video: ${error.message}`, 500);
    }
  }

  public async getVideos(instructorId: string, role: string): Promise<any> {
    try {
      const whereClause = role === "admin" ? {} : { instructorId };
      const videos = await Video.findAll({ where: whereClause, order: [["createdAt", "DESC"]] });
      return videos;
    } catch (error: any) {
      throw new AppError(`Database error retrieving videos: ${error.message}`, 500);
    }
  }

  public async getVideoById(id: string): Promise<any> {
    try {
      const video = await Video.findByPk(id);
      if (!video) throw new AppError("Video not found", 404);
      return video;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Database error retrieving video: ${error.message}`, 500);
    }
  }
}
