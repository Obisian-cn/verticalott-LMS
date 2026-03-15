import { Router } from "express";
import { VideoController } from "../controllers/video.controller";
import { validate } from "../middlewares/validate";
import { uploadVideoSchema } from "../validations/video.validation";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();
const videoController = new VideoController();

router.post(
  "/upload",
  authenticate,
  authorize(["instructor", "admin"]),
  validate(uploadVideoSchema),
  videoController.uploadVideo
);

router.get("/:id", authenticate, videoController.getVideoById);

router.delete(
  "/:id",
  authenticate,
  authorize(["instructor", "admin"]),
  videoController.deleteVideo
);

export default router;
