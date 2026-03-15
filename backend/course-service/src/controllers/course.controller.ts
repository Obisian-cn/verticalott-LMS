import { Request, Response, NextFunction } from "express";
import { CourseService } from "../services/course.service";
import { created, ok } from "../utils/response";
import { AuthRequest } from "../middlewares/auth";

export class CourseController {
  private courseService = new CourseService();

  public createCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const course = await this.courseService.createCourse(req.user!.id, req.body);
      return created(res, course, "Course created successfully");
    } catch (err) {
      next(err);
    }
  };

  public getCourses = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const courses = await this.courseService.getCourses();
      return ok(res, courses, "Courses retrieved successfully");
    } catch (err) {
      next(err);
    }
  };

  public getCourseById = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const course = await this.courseService.getCourseById(req.params.id);
      return ok(res, course, "Course retrieved successfully");
    } catch (err) {
      next(err);
    }
  };

  public updateCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const course = await this.courseService.updateCourse(
        req.params.id,
        req.user!.id,
        req.user!.role,
        req.body
      );
      return ok(res, course, "Course updated successfully");
    } catch (err) {
      next(err);
    }
  };

  public deleteCourse = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.courseService.deleteCourse(req.params.id, req.user!.id, req.user!.role);
      return ok(res, null, "Course deleted successfully");
    } catch (err) {
      next(err);
    }
  };
}
