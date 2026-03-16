import Mux from "@mux/mux-node";
import fs from "fs";
import axios from "axios";
import { AppError } from "../utils/AppError";
import { logger } from "../utils/logger";

const mux = new Mux({
  tokenId: process.env.MUX_TOKEN_ID || "dummy",
  tokenSecret: process.env.MUX_TOKEN_SECRET || "dummy",
});

export class MuxService {
  /**
   * Uploads a video stream to Mux and returns the playback ID
   * Uses direct uploads: creates an upload URL, streams the file, then waits for the asset.
   */
  public async uploadVideo(filePath: string): Promise<{ playbackId: string; assetId: string }> {
    try {
      logger.info(`Starting Mux video upload for file: ${filePath}`);
      
      // 1) Create Upload URL
      const upload = await mux.video.uploads.create({
        new_asset_settings: {
          playback_policy: ["public"]
        },
        cors_origin: "*"
      });

      // 2) Upload file via stream
      logger.info(`Uploading stream to Mux direct upload URL...`);
      const fileStream = fs.createReadStream(filePath);
      const stat = fs.statSync(filePath);
      
      await axios.put(upload.url, fileStream, {
        headers: {
          "Content-Length": stat.size,
          // Remove default content type, Mux handles it or set to video/mp4
        },
        maxContentLength: Infinity,
        maxBodyLength: Infinity
      });
      logger.info(`Stream uploaded successfully to Mux.`);

      // 3) Wait for Asset Creation (Polling)
      let assetId = upload.asset_id;
      let retries = 0;
      while (!assetId && retries < 15) {
        await new Promise(resolve => setTimeout(resolve, 2000));
        const updatedUpload = await mux.video.uploads.retrieve(upload.id);
        assetId = updatedUpload.asset_id;
        retries++;
      }

      if (!assetId) {
        throw new AppError("Mux upload completed but asset creation timed out", 500);
      }

      // 4) Retrieve Playback ID
      let playbackId = "";
      retries = 0;
      while (!playbackId && retries < 15) {
        const asset = await mux.video.assets.retrieve(assetId);
        playbackId = asset.playback_ids?.[0]?.id || "";
        if (!playbackId) {
          await new Promise(resolve => setTimeout(resolve, 2000));
          retries++;
        }
      }

      if (!playbackId) {
         throw new AppError("Mux asset created but missing playback ID", 500);
      }

      return {
        playbackId,
        assetId,
      };
    } catch (error: any) {
      logger.error("Mux upload failed", { error });
      throw new AppError("Failed to upload video to Mux: " + (error.message || ""), 500);
    }
  }

  public getPlaybackUrl(playbackId: string): string {
    return `https://stream.mux.com/${playbackId}.m3u8`;
  }
}

export const muxService = new MuxService();
