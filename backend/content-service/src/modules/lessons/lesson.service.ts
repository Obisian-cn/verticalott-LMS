import { Section, Lesson, Course, Video } from "../../models";
import { AppError } from "../../utils/AppError";
import { logger } from "../../utils/logger";

export class LessonService {
  /**
   * Creates a lesson mapped strictly to an independently uploaded Video
   */
  public async createLesson(
    sectionId: string,
    data: { title: string; description: string; videoId?: string; resourcePdfUrl?: string; endGoal?: string },
    instructorId: string,
    role: string
  ): Promise<any> {
    try {
      const section = await Section.findByPk(sectionId, { include: [{ model: Course, as: "Course" }] });
      if (!section || !section.Course) {
        throw new AppError("Section or associated Course not found", 404);
      }

      if (role !== "admin" && section.Course.instructorId !== instructorId) {
        throw new AppError("Forbidden: Only the instructor or admin can modify this course content", 403);
      }

      // Determine current order
      const orderCount = await Lesson.count({ where: { sectionId } });
      const order = orderCount + 1;

      // 1) Store lesson in DB
      const lesson = await Lesson.create({
        sectionId,
        title: data.title,
        description: data.description || "",
        type: "video",
        videoId: data.videoId || null,
        resourcePdfUrl: data.resourcePdfUrl || null,
        endGoal: data.endGoal || null,
        status: data.videoId ? "ready" : "pending",
        order,
      });

      return {
        id: lesson.id,
        title: lesson.title,
        videoId: lesson.videoId,
        resourcePdfUrl: lesson.resourcePdfUrl,
        endGoal: lesson.endGoal,
      };
    } catch (error: any) {
      console.error("DB Query Error in createLesson:", error);
      if (error instanceof AppError) throw error;
      throw new AppError(`Database error creating lesson: ${error.message}`, 500);
    }
  }

  /**
   * Retrieve Curriculum Flow
   */
  public async getCourseCurriculum(courseId: string) {
    try {
      const course = await Course.findByPk(courseId, {
        include: [
          {
            model: Section,
            as: "sections",
            include: [
              {
                model: Lesson,
                as: "lessons",
                include: [
                  {
                    model: Video,
                    as: "video"
                  }
                ]
              },
            ],
          },
        ],
        order: [
          [{ model: Section, as: "sections" }, "order", "ASC"],
          [{ model: Section, as: "sections" }, { model: Lesson, as: "lessons" }, "order", "ASC"],
        ],
      });

      if (!course) throw new AppError("Course not found", 404);

      return {
        sections: (course as any).sections?.map((section: any) => ({
          id: section.id,
          title: section.title,
          lessons: section.lessons?.map((lesson: any) => ({
            id: lesson.id,
            title: lesson.title,
            description: lesson.description,
            videoId: lesson.videoId || null,
            resourcePdfUrl: lesson.resourcePdfUrl || null,
            endGoal: lesson.endGoal || null,
            video: lesson.video ? {
              id: lesson.video.id,
              playbackId: lesson.video.playbackId,
              videoUrl: lesson.video.videoUrl,
              title: lesson.video.title
            } : null
          })),
        })),
      };
    } catch (error: any) {
      console.error("DB Query Error in getCourseCurriculum:", error);
      if (error instanceof AppError) throw error;
      throw new AppError(`Database error formatting query: ${error.message}`, 500);
    }
  }
}
