import { Request, Response, NextFunction } from "express";
import { EnrollmentService } from "../services/enrollment.service";
import { created, ok } from "../utils/response";
import { AuthRequest } from "../middlewares/auth";
import { AppError } from "../utils/AppError";

export class EnrollmentController {
  private enrollmentService = new EnrollmentService();

  public createEnrollment = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const { courseId, paymentId } = req.body;
      const enrollment = await this.enrollmentService.createEnrollment(
        req.user!.id,
        courseId,
        paymentId
      );
      return created(res, enrollment, "Successfully enrolled in course");
    } catch (err) {
      next(err);
    }
  };

  public getUserEnrollments = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (req.user!.role !== "admin" && req.user!.id !== req.params.id) {
        throw new AppError("Forbidden: Cannot view other users' enrollments", 403);
      }

      const enrollments = await this.enrollmentService.getUserEnrollments(req.params.id);
      return ok(res, enrollments, "Enrollments retrieved successfully");
    } catch (err) {
      next(err);
    }
  };
}
