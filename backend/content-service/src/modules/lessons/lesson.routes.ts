import { Router } from "express";
import { LessonController } from "./lesson.controller";
import { authenticate, authorize } from "../../middlewares/auth";
import { upload } from "../../utils/upload";
import { ContentController } from "../../controllers/content.controller"; // Reuse Section logic

const router = Router();
const lessonController = new LessonController();
const contentController = new ContentController();

// Create Section
router.post(
  "/sections",
  authenticate,
  authorize(["instructor", "admin"]),
  contentController.createSection
);

// Lesson Flow with Video Upload (Multer middleware ensures streaming / OS disk fallback)
router.post(
  "/sections/:sectionId/lessons",
  authenticate,
  authorize(["instructor", "admin"]),
  upload.single("video"), // handle the multipart upload
  lessonController.createLesson
);

// Get Course Curriculum
router.get("/courses/:courseId/curriculum", lessonController.getCurriculum);

export default router;
