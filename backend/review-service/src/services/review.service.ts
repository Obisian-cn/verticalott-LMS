import { Review, Course } from "../models";
import { AppError } from "../utils/AppError";

export class ReviewService {
  public async createReview(userId: string, data: any) {
    const course = await Course.findByPk(data.courseId);
    if (!course) throw new AppError("Course not found", 404);

    const existing = await Review.findOne({ where: { userId, courseId: data.courseId } });
    if (existing) throw new AppError("You have already reviewed this course", 409);

    const review = await Review.create({
      userId,
      courseId: data.courseId,
      rating: data.rating,
      comment: data.comment
    });

    return review;
  }

  public async getCourseReviews(courseId: string) {
    const reviews = await Review.findAll({
      where: { courseId }
    });
    return reviews;
  }

  public async deleteReview(id: string, userId: string, role: string) {
    const review = await Review.findByPk(id);
    if (!review) throw new AppError("Review not found", 404);

    if (role !== "admin" && review.userId !== userId) {
      throw new AppError("Forbidden: Cannot delete this review", 403);
    }

    await review.destroy();
    return { success: true };
  }
}
