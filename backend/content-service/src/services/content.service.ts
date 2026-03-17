import { Section, Lesson, Course } from "../models";
import { AppError } from "../utils/AppError";

export class ContentService {
  public async createSection(data: any, instructorId: string, role: string) {
    try {
      const course = await Course.findByPk(data.courseId);
      if (!course) throw new AppError("Course not found", 404);

      if (role !== "admin" && course.instructorId !== instructorId) {
        throw new AppError("Forbidden: Only the instructor or admin can modify this course content", 403);
      }

      const section = await Section.create(data);
      return section;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Database error creating section: ${error.message}`, 500);
    }
  }

  public async createLesson(data: any, instructorId: string, role: string) {
    try {
      const section = await Section.findByPk(data.sectionId, { include: [Course] });
      if (!section || !section.Course) throw new AppError("Section or associated Course not found", 404);

      if (role !== "admin" && section.Course.instructorId !== instructorId) {
        throw new AppError("Forbidden: Only the instructor or admin can modify this course content", 403);
      }

      const lesson = await Lesson.create(data);
      return lesson;
    } catch (error: any) {
      if (error instanceof AppError) throw error;
      throw new AppError(`Database error creating lesson: ${error.message}`, 500);
    }
  }

  public async getSectionsByCourseId(courseId: string) {
    try {
      console.log("courseId----->", courseId);
      const sections = await Section.findAll({
        where: { courseId },
        include: [
          {
            model: Lesson,
            as: "lessons",
          },
        ],
        order: [
          ["order", "ASC"],
          [{ model: Lesson, as: "lessons" }, "order", "ASC"],
        ],
      });
      return sections;
    } catch (error: any) {
      console.error("DB Query Error in getSectionsByCourseId:", error);
      if (error instanceof AppError) throw error;
      throw new AppError(`Database error formatting query: ${error.message}`, 500);
    }
  }
}

