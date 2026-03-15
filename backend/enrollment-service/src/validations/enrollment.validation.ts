import Joi from "joi";

export const createEnrollmentSchema = Joi.object({
  courseId: Joi.string().required(),
  paymentId: Joi.string().optional()
});
