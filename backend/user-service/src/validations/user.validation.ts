import Joi from "joi";

export const updateUserSchema = Joi.object({
  name: Joi.string().optional(),
  email: Joi.string().email().optional(),
  password: Joi.string().min(8).optional(),
  role: Joi.string().valid("student", "instructor", "admin").optional()
}).min(1);
