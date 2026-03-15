import Joi from "joi";

export const createSectionSchema = Joi.object({
  courseId: Joi.string().required(),
  title: Joi.string().required(),
  order: Joi.number().min(0).optional(),
});

export const createLessonSchema = Joi.object({
  sectionId: Joi.string().required(),
  title: Joi.string().required(),
  type: Joi.string().valid("video", "article", "quiz").required(),
  content: Joi.string().optional(),
  videoId: Joi.string().optional(),
  order: Joi.number().min(0).optional(),
});
