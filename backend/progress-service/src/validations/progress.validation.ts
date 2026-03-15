import Joi from "joi";

export const trackProgressSchema = Joi.object({
  lessonId: Joi.string().required(),
  completed: Joi.boolean().required(),
});
