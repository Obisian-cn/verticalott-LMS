import { Section, Lesson, Course } from "../models";
import { AppError } from "../utils/AppError";

export class ContentService {
  public async createSection(data: any, instructorId: string, role: string) {
    const course = await Course.findByPk(data.courseId);
    if (!course) throw new AppError("Course not found", 404);

    if (role !== "admin" && course.instructorId !== instructorId) {
      throw new AppError("Forbidden: Only the instructor or admin can modify this course content", 403);
    }

    const section = await Section.create(data);
    return section;
  }

  public async createLesson(data: any, instructorId: string, role: string) {
    const section = await Section.findByPk(data.sectionId, { include: [Course] });
    if (!section || !section.Course) throw new AppError("Section or associated Course not found", 404);

    if (role !== "admin" && section.Course.instructorId !== instructorId) {
      throw new AppError("Forbidden: Only the instructor or admin can modify this course content", 403);
    }

    const lesson = await Lesson.create(data);
    return lesson;
  }

  public async getSectionsByCourseId(courseId: string) {
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
  }
}
