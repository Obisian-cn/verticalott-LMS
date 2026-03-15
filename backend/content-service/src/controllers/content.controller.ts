import { Request, Response, NextFunction } from "express";
import { ContentService } from "../services/content.service";
import { created, ok } from "../utils/response";
import { AuthRequest } from "../middlewares/auth";

export class ContentController {
  private contentService = new ContentService();

  public createSection = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const section = await this.contentService.createSection(
        req.body,
        req.user!.id,
        req.user!.role
      );
      return created(res, section, "Section created successfully");
    } catch (err) {
      next(err);
    }
  };

  public createLesson = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const lesson = await this.contentService.createLesson(
        req.body,
        req.user!.id,
        req.user!.role
      );
      return created(res, lesson, "Lesson created successfully");
    } catch (err) {
      next(err);
    }
  };

  public getCourseSections = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const sections = await this.contentService.getSectionsByCourseId(req.params.id);
      return ok(res, sections, "Course sections retrieved successfully");
    } catch (err) {
      next(err);
    }
  };
}
