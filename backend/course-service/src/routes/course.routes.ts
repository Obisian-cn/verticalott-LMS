import { Router } from "express";
import { CourseController } from "../controllers/course.controller";
import { validate } from "../middlewares/validate";
import { createCourseSchema, updateCourseSchema } from "../validations/course.validation";
import { authenticate, authorize } from "../middlewares/auth";

const router = Router();
const courseController = new CourseController();

// Public routes
router.get("/", courseController.getCourses);
router.get("/:id", courseController.getCourseById);

// Protected routes
router.post(
  "/",
  authenticate,
  authorize(["instructor", "admin"]),
  validate(createCourseSchema),
  courseController.createCourse
);
router.patch(
  "/:id",
  authenticate,
  authorize(["instructor", "admin"]),
  validate(updateCourseSchema),
  courseController.updateCourse
);
router.delete(
  "/:id",
  authenticate,
  authorize(["instructor", "admin"]),
  courseController.deleteCourse
);

export default router;
