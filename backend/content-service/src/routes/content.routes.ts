import { Router } from "express";
import { ContentController } from "../controllers/content.controller";
import { validate } from "../middlewares/validate";
import { createSectionSchema, createLessonSchema } from "../validations/content.validation";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();
const contentController = new ContentController();

router.post(
  "/sections",
  authenticate,
  authorize(["instructor", "admin"]),
  validate(createSectionSchema),
  contentController.createSection
);

router.post(
  "/lessons",
  authenticate,
  authorize(["instructor", "admin"]),
  validate(createLessonSchema),
  contentController.createLesson
);

router.get("/courses/:id/sections", contentController.getCourseSections);

export default router;
