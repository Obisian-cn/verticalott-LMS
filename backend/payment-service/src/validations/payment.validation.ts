import Joi from "joi";

export const createPaymentSchema = Joi.object({
  courseId: Joi.string().required(),
  amount: Joi.number().min(0).required(),
  currency: Joi.string().default("USD").optional(),
  provider: Joi.string().required(),
});

export const webhookSchema = Joi.object().unknown(true);
