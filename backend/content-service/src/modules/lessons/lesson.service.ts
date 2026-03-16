import { Section, Lesson, Course } from "../../models";
import { AppError } from "../../utils/AppError";
import { muxService } from "../../services/mux.service";
import fs from "fs";
import { logger } from "../../utils/logger";

export class LessonService {
  /**
   * Creates a lesson with multipart video upload to Mux explicitly
   */
  public async createLessonWithVideo(
    sectionId: string,
    data: { title: string; description: string },
    filePath: string,
    instructorId: string,
    role: string
  ): Promise<any> {
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

    let videoPlaybackId = null;
    let videoUrl = null;
    let status = "pending";

    // 1) Stream upload to Mux
    if (filePath) {
      try {
        const { playbackId } = await muxService.uploadVideo(filePath);
        videoPlaybackId = playbackId;
        videoUrl = muxService.getPlaybackUrl(playbackId);
        status = "ready";
      } catch (err: any) {
        throw new AppError("Video upload failed: " + err.message, 500);
      } finally {
        // Remove temp file from disk immediately
        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        } catch (cleanupErr) {
          logger.warn("Failed to clean up temp file", { error: cleanupErr });
        }
      }
    }

    // 2) Store lesson in DB
    const lesson = await Lesson.create({
      sectionId,
      title: data.title,
      description: data.description || "",
      type: "video",
      videoPlaybackId,
      videoUrl,
      status,
      order,
    });

    return {
      id: lesson.id,
      title: lesson.title,
      videoUrl: lesson.videoUrl,
    };
  }

  /**
   * Retrieve Curriculum Flow
   */
  public async getCourseCurriculum(courseId: string) {
    const course = await Course.findByPk(courseId, {
      include: [
        {
          model: Section,
          as: "sections",
          include: [
            {
              model: Lesson,
              as: "lessons",
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
          videoUrl: lesson.videoUrl || null,
        })),
      })),
    };
  }
}
