import Joi from "joi";

export const createReviewSchema = Joi.object({
  courseId: Joi.string().required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().optional()
});
