import dotenv from "dotenv";
dotenv.config();

import express, { NextFunction, Request, Response } from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import axios from "axios";
import { body } from "express-validator";
import { authenticate, authorize, logger, AppError, fail, ok, created, validate } from "@lms/common/src";
import sequelize from "@lms/database/src/sequelize";
import { VideoAsset } from "@lms/database/src/models/VideoAsset";

const app = express();
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(
  morgan("combined", {
    stream: {
      write: (message) => logger.info(message.trim())
    }
  })
);

const muxBaseUrl = "https://api.mux.com";
const muxTokenId = process.env.MUX_TOKEN_ID || "";
const muxTokenSecret = process.env.MUX_TOKEN_SECRET || "";

const muxClient = axios.create({
  baseURL: muxBaseUrl,
  auth: {
    username: muxTokenId,
    password: muxTokenSecret
  }
});

app.post(
  "/videos/upload-url",
  authenticate(),
  authorize(["instructor", "admin"]),
  validate([
    body("lectureId").isString().notEmpty(),
    body("corsOrigin").optional().isString()
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lectureId, corsOrigin } = req.body;
      const response = await muxClient.post("/video/v1/uploads", {
        new_asset_settings: {
          playback_policy: ["public"]
        },
        cors_origin: corsOrigin || "*"
      });

      const upload = response.data.data;

      return created(res, {
        uploadUrl: upload.url,
        uploadId: upload.id,
        lectureId
      });
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  "/videos/asset",
  authenticate(),
  authorize(["instructor", "admin"]),
  validate([
    body("lectureId").isString().notEmpty(),
    body("muxAssetId").isString().notEmpty(),
    body("playbackId").isString().notEmpty()
  ]),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { lectureId, muxAssetId, playbackId } = req.body;
      const asset = await VideoAsset.create({
        lectureId,
        muxAssetId,
        playbackId,
        status: "pending"
      });
      return created(res, asset);
    } catch (err) {
      next(err);
    }
  }
);

app.get(
  "/videos/:id/playback",
  authenticate(),
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const video = await VideoAsset.findByPk(req.params.id);
      if (!video) {
        throw new AppError("Video not found", 404);
      }
      return ok(res, { playbackId: video.playbackId, status: video.status });
    } catch (err) {
      next(err);
    }
  }
);

app.post(
  "/mux/webhook",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { type, data } = req.body;

      if (!type || !data) {
        throw new AppError("Invalid Mux webhook payload", 400);
      }

      if (type === "video.asset.ready") {
        const muxAssetId = data.id;
        const playbackId = data.playback_ids?.[0]?.id;

        if (!muxAssetId || !playbackId) {
          throw new AppError("Missing Mux asset identifiers", 400);
        }

        const asset = await VideoAsset.findOne({ where: { muxAssetId } });
        if (asset) {
          asset.status = "ready";
          asset.playbackId = playbackId;
          await asset.save();
        }
      }

      if (type === "video.asset.errored") {
        const muxAssetId = data.id;
        const asset = await VideoAsset.findOne({ where: { muxAssetId } });
        if (asset) {
          asset.status = "errored";
          await asset.save();
        }
      }

      return ok(res, { received: true });
    } catch (err) {
      next(err);
    }
  }
);

app.use((req, _res, next) => {
  next(new AppError(`Route ${req.method} ${req.path} not found`, 404));
});

app.use(
  (err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof AppError) {
      logger.warn(err.message, { statusCode: err.statusCode, details: err.details });
      return fail(res, err.statusCode, err.message, err.details);
    }
    logger.error("Unhandled error", { error: err });
    return fail(res, 500, "Internal server error");
  }
);

const port = process.env.PORT || 3005;

sequelize
  .authenticate()
  .then(() => sequelize.sync())
  .then(() => {
    app.listen(port, () => {
      logger.info(`Video service listening on port ${port}`);
    });
  })
  .catch((err) => {
    logger.error("Failed to start video service", { error: err });
    process.exit(1);
  });

