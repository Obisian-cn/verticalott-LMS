import { Progress, Lesson, Section, Course } from "../models";
import { AppError } from "../utils/AppError";

export class ProgressService {
  public async trackProgress(userId: string, data: any) {
    const lesson = await Lesson.findByPk(data.lessonId, {
      include: [{ model: Section }]
    });

    if (!lesson || !lesson.Section) {
      throw new AppError("Lesson not found", 404);
    }

    let progress = await Progress.findOne({
      where: { userId, lessonId: data.lessonId },
    });

    if (progress) {
      progress.completed = data.completed;
      if (data.completed) {
        progress.completedAt = new Date();
      } else {
        progress.completedAt = undefined as any;
      }
      await progress.save();
    } else {
      progress = await Progress.create({
        userId,
        lessonId: data.lessonId,
        completed: data.completed,
        completedAt: data.completed ? new Date() : undefined,
      });
    }

    return progress;
  }

  public async getCourseProgress(userId: string, courseId: string) {
    const course = await Course.findByPk(courseId, {
      include: [{ model: Section, include: [{ model: Lesson }] }],
    });

    if (!course) throw new AppError("Course not found", 404);

    const lessonIds = course.Sections?.flatMap((s: any) =>
      s.lessons?.map((l: any) => l.id) || []
    ) || [];

    const progress = await Progress.findAll({
      where: {
        userId,
        lessonId: lessonIds,
      },
    });

    return progress;
  }
}
