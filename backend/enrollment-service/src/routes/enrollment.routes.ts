import { Router } from "express";
import { EnrollmentController } from "../controllers/enrollment.controller";
import { validate } from "../middlewares/validate";
import { createEnrollmentSchema } from "../validations/enrollment.validation";
import { authenticate } from "../middlewares/auth";

const router = Router();
const enrollmentController = new EnrollmentController();

// Create enrollment (usually called after successful payment, or directly for free courses)
router.post("/", authenticate, validate(createEnrollmentSchema), enrollmentController.createEnrollment);

// Use router to handle /users/:id/enrollments logic, typically mounted at root or /enrollments
router.get("/users/:id/enrollments", authenticate, enrollmentController.getUserEnrollments);

export default router;
