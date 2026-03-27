import Joi from "joi";

export const trackProgressSchema = Joi.object({
  videoId: Joi.string().required(),
  completed: Joi.boolean().required(),
  progressSeconds: Joi.number().optional().default(0),
});
