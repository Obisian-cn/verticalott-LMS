import { Router } from "express";
import { LessonController } from "./lesson.controller";
import { authenticate, authorize } from "../../middlewares/auth";
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

// Lesson Flow creation
import { uploadLocal } from "../../utils/upload";

router.post(
  "/:sectionId/lessons",
  authenticate,
  authorize(["instructor", "admin"]),
  lessonController.createLesson
);

// Upload PDF for lesson
router.post(
  "/upload/pdf",
  authenticate,
  authorize(["instructor", "admin"]),
  uploadLocal.single("pdf"),
  lessonController.uploadPdf
);

// Get Course Curriculum
router.get("/courses/:courseId/curriculum", lessonController.getCurriculum);

export default router;
