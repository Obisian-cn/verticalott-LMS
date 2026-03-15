import Joi from "joi";

export const createPaymentSchema = Joi.object({
  courseId: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  currency: Joi.string().default("USD").optional(),
  provider: Joi.string().required(),
});

export const webhookSchema = Joi.object({
  // Dependent on provider webhook structure, assuming basic
  paymentId: Joi.string().required(),
  status: Joi.string().valid("completed", "failed").required(),
});
