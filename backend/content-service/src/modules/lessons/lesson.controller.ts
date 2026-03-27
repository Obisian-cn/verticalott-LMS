import { Request, Response, NextFunction } from "express";
import { LessonService } from "./lesson.service";
import { created, ok } from "../../utils/response";
import { AuthRequest } from "../../middlewares/auth";
import { AppError } from "../../utils/AppError";

export class LessonController {
  private lessonService = new LessonService();

  public createLesson = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const sectionId = req.params.sectionId;
      const { title, description, videoId, resourcePdfUrl, endGoal } = req.body;
      
      if (!title || !description) {
        throw new AppError("Title and description are required", 400);
      }

      const lessonResponse = await this.lessonService.createLesson(
        sectionId,
        { title, description, videoId, resourcePdfUrl, endGoal },
        req.user!.id,
        req.user!.role
      );

      return created(res, lessonResponse, "Lesson created successfully");
    } catch (err) {
      next(err);
    }
  };

  public getCurriculum = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courseId = req.params.courseId;
      const curriculum = await this.lessonService.getCourseCurriculum(courseId);
      return ok(res, curriculum, "Course curriculum retrieved successfully");
    } catch (err) {
      next(err);
    }
  };
}
