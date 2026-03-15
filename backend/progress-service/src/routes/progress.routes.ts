import { Router } from "express";
import { ProgressController } from "../controllers/progress.controller";
import { validate } from "../middlewares/validate";
import { trackProgressSchema } from "../validations/progress.validation";
import { authenticate } from "../middlewares/auth";

const router = Router();
const progressController = new ProgressController();

// POST /progress
router.post(
  "/",
  authenticate,
  validate(trackProgressSchema),
  progressController.trackProgress
);

// We'll export this router and mount it. We also need GET /courses/:id/progress
// Assuming it's mounted at root
router.get("/courses/:id/progress", authenticate, progressController.getCourseProgress);

export default router;
