import Joi from "joi";

export const createCourseSchema = Joi.object({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().min(0).optional(),
  category: Joi.string().optional(),
  thumbnail: Joi.string().uri().optional(),
});

export const updateCourseSchema = Joi.object({
  title: Joi.string().optional(),
  description: Joi.string().optional(),
  price: Joi.number().min(0).optional(),
  category: Joi.string().optional(),
  thumbnail: Joi.string().uri().optional(),
}).min(1);
