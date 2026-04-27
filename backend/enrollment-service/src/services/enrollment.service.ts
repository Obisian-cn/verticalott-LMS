import { Enrollment, Course, Section, Lesson, UserVideoProgress } from "../models";
import { AppError } from "../utils/AppError";

export class EnrollmentService {
  public async createEnrollment(userId: string, courseId: string, paymentId?: string) {
    try {
      const course = await Course.findByPk(courseId);
      if (!course) throw new AppError("Course not found", 404);

      const existing = await Enrollment.findOne({ where: { userId, courseId } });
      if (existing) return existing;

      const enrollment = await Enrollment.create({
        userId,
        courseId,
        paymentId,
        status: "active",
        enrolledAt: new Date(),
      });

      return enrollment;
    } catch (error: any) {
      console.error("Database error in createEnrollment:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to create enrollment due to database issue", 500);
    }
  }

  public async getUserEnrollments(userId: string) {
    try {
      const enrollments = await Enrollment.findAll({
        where: { userId },
        include: [{
          model: Course,
          as: "course",
          include: [{
            model: Section,
            as: "sections",
            include: [{
              model: Lesson,
              as: "lessons"
            }]
          }]
        }],
      });

      const enrichedEnrollments = await Promise.all(enrollments.map(async (enrollment: any) => {
        const enrollmentJSON = enrollment.toJSON();
        const course = enrollmentJSON.course;

        const videoIds = new Set<string>();

        if (course && course.sections) {
          for (const section of course.sections) {
            if (section.lessons) {
              for (const lesson of section.lessons) {
                if (lesson.videoId) {
                  videoIds.add(lesson.videoId);
                }
              }
            }
          }
        }

        const totalVideos = videoIds.size;
        let completedVideos = 0;
        let progressPercent = 0;

        if (totalVideos > 0) {
          const userProgresses = await UserVideoProgress.findAll({
            where: {
              userId,
              videoId: Array.from(videoIds)
            }
          });

          completedVideos = userProgresses.filter((p: any) => p.completed).length;
          progressPercent = (completedVideos / totalVideos) * 100;
        }

        if (enrollmentJSON.course) {
          delete enrollmentJSON.course.sections;
        }

        return {
          ...enrollmentJSON,
          progress: progressPercent
        };
      }));

      return enrichedEnrollments;
    } catch (error: any) {
      console.error("Database query error in getUserEnrollments:", error);
      if (error instanceof AppError) throw error;
      throw new AppError("Failed to fetch enrollments due to database issue", 500);
    }
  }
}
