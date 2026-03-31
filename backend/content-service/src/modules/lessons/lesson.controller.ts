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
      console.log("CREATE LESSON RECEIVED BODY:", req.body);
      
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

  public uploadPdf = async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.file) {
        throw new AppError("No PDF file uploaded", 400);
      }
      
      const fileUrl = `${req.protocol}://${req.get("host")}/content/uploads/${req.file.filename}`;
      // In a real production setup, req.get('host') might be the gateway or direct service depending on network
      // But since we proxy, the host header is preserved by default (changeOrigin: true in the gateway).
      // Here we just hardcode the path relative to the domain (it works with the gateway).
      return ok(res, { url: fileUrl }, "PDF uploaded successfully");
    } catch (err) {
      next(err);
    }
  };
}
