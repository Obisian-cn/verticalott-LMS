import { UserVideoProgress, Lesson, Section, Course, Video } from "../models";
import { AppError } from "../utils/AppError";

export class ProgressService {
  public async trackProgress(userId: string, data: { videoId: string; completed: boolean; progressSeconds?: number }) {
    const video = await Video.findByPk(data.videoId);

    if (!video) {
      throw new AppError("Video not found", 404);
    }

    let progress = await UserVideoProgress.findOne({
      where: { userId, videoId: data.videoId },
    });

    if (progress) {
      progress.completed = data.completed;
      if (data.progressSeconds !== undefined) {
        progress.progressSeconds = Math.max(progress.progressSeconds || 0, data.progressSeconds);
      }
      await progress.save();
    } else {
      progress = await UserVideoProgress.create({
        userId,
        videoId: data.videoId,
        completed: data.completed,
        progressSeconds: data.progressSeconds || 0,
      });
    }

    return progress;
  }

  public async getCourseProgress(userId: string, courseId: string) {
    const course = await Course.findByPk(courseId, {
      include: [{ model: Section, as: "sections", include: [{ model: Lesson, as: "lessons" }] }],
    });

    if (!course) throw new AppError("Course not found", 404);

    const videoIdsArray = (course as any).sections?.flatMap((s: any) =>
      s.lessons?.map((l: any) => l.videoId).filter((vId: any) => vId != null) || []
    ) || [];

    // Filter unique videoIds related to this course
    const videoIds = [...new Set(videoIdsArray)];

    const progress = await UserVideoProgress.findAll({
      where: {
        userId,
        videoId: videoIds as any,
      },
    });

    return progress;
  }
}
