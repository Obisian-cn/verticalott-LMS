import { VideoAsset, Lesson, Section, Course } from "../models";
import { AppError } from "../utils/AppError";

export class VideoService {
  public async uploadVideo(data: any, instructorId: string, role: string) {
    // In a real scenario, this would handle Mux integration or AWS S3 upload logic
    if (data.lessonId) {
      const lesson = await Lesson.findByPk(data.lessonId, {
        include: [{ model: Section, include: [{ model: Course }] }],
      });
      if (lesson && lesson.Section && lesson.Section.Course) {
        if (role !== "admin" && lesson.Section.Course.instructorId !== instructorId) {
          throw new AppError("Forbidden: Cannot upload video to this lesson", 403);
        }
      }
    }

    const video = await VideoAsset.create(data);
    return video;
  }

  public async getVideoById(id: string) {
    const video = await VideoAsset.findByPk(id);
    if (!video) throw new AppError("Video not found", 404);

    return video;
  }

  public async deleteVideo(id: string, instructorId: string, role: string) {
    const video = await VideoAsset.findByPk(id, {
      include: [
        {
          model: Lesson,
          include: [{ model: Section, include: [{ model: Course }] }],
        },
      ],
    });

    if (!video) throw new AppError("Video not found", 404);

    if (video.Lesson && video.Lesson.Section && video.Lesson.Section.Course) {
       if (role !== "admin" && video.Lesson.Section.Course.instructorId !== instructorId) {
          throw new AppError("Forbidden: Cannot delete video", 403);
       }
    }

    await video.destroy();
    return { success: true };
  }
}
