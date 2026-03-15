import { Request, Response, NextFunction } from "express";
import { ReviewService } from "../services/review.service";
import { created, ok } from "../utils/response";
import { AuthRequest } from "../middlewares/auth";

export class ReviewController {
  private reviewService = new ReviewService();

  public createReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const review = await this.reviewService.createReview(req.user!.id, req.body);
      return created(res, review, "Review submitted successfully");
    } catch (err) {
      next(err);
    }
  };

  public getCourseReviews = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const reviews = await this.reviewService.getCourseReviews(req.params.id);
      return ok(res, reviews, "Reviews retrieved successfully");
    } catch (err) {
      next(err);
    }
  };

  public deleteReview = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      await this.reviewService.deleteReview(
        req.params.id,
        req.user!.id,
        req.user!.role
      );
      return ok(res, null, "Review deleted successfully");
    } catch (err) {
      next(err);
    }
  };
}
