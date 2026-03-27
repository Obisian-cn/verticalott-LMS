import { Router } from "express";
import { VideoController } from "./video.controller";
import { authenticate, authorize } from "../../middlewares/auth";
import { upload } from "../../utils/upload";
import { validate } from "../../middlewares/validate";
import Joi from "joi";

const router = Router();
const videoController = new VideoController();

const uploadVideoSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().allow("", null).optional(),
});

router.post(
  "/",
  authenticate,
  authorize(["instructor", "admin"]),
  upload.single("video"), // handle the multipart upload mapping
  videoController.uploadVideo
);

router.get(
  "/",
  authenticate,
  authorize(["instructor", "admin"]),
  videoController.getVideos
);

router.get(
  "/:id",
  authenticate,
  authorize(["instructor", "admin"]),
  videoController.getVideoById
);

export default router;
