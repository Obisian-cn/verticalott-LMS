import { Router } from "express";
import { ReviewController } from "../controllers/review.controller";
import { validate } from "../middlewares/validate";
import { createReviewSchema } from "../validations/review.validation";
import { authenticate } from "../middlewares/auth";

const router = Router();
const reviewController = new ReviewController();

// POST /reviews
router.post(
  "/",
  authenticate,
  validate(createReviewSchema),
  reviewController.createReview
);

// GET /courses/:id/reviews
router.get("/courses/:id/reviews", reviewController.getCourseReviews);

// DELETE /reviews/:id
router.delete("/:id", authenticate, reviewController.deleteReview);

export default router;
