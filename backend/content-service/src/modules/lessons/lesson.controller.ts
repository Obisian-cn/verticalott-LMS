import { Request, Response, NextFunction } from "express";
import { LessonService } from "./lesson.service";
import { created, ok } from "../../utils/response";
import { AuthRequest } from "../../middlewares/auth";
import { AppError } from "../../utils/AppError";
import fs from "fs";

export class LessonController {
  private lessonService = new LessonService();

  public createLesson = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const sectionId = req.params.sectionId;
      const { title, description } = req.body;
      const file = req.file;

      if (!file) {
        throw new AppError("Video file is required", 400);
      }
      
      if (!title || !description) {
        // clean up file in case validation failed
        try { fs.unlinkSync(file.path) } catch (e) {}
        throw new AppError("Title and description are required", 400);
      }

      const lessonResponse = await this.lessonService.createLessonWithVideo(
        sectionId,
        { title, description },
        file.path,
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
