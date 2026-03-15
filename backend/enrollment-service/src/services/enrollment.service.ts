import { Enrollment, Course } from "../models";
import { AppError } from "../utils/AppError";

export class EnrollmentService {
  public async createEnrollment(userId: string, courseId: string, paymentId?: string) {
    const course = await Course.findByPk(courseId);
    if (!course) throw new AppError("Course not found", 404);

    const existing = await Enrollment.findOne({ where: { userId, courseId } });
    if (existing) throw new AppError("Already enrolled in this course", 409);

    const enrollment = await Enrollment.create({
      userId,
      courseId,
      paymentId
    });

    return enrollment;
  }

  public async getUserEnrollments(userId: string) {
    const enrollments = await Enrollment.findAll({
      where: { userId },
      include: [{ model: Course }],
    });
    return enrollments;
  }
}
