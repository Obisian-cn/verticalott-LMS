import Joi from "joi";

export const uploadVideoSchema = Joi.object({
  title: Joi.string().required(),
  lessonId: Joi.string().optional(),
  muxPlaybackId: Joi.string().optional(),
  duration: Joi.number().optional()
});
