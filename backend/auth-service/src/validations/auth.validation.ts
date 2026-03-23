import Joi from "joi";

export const loginSchema = Joi.object({
  token: Joi.string().required()
});

export const refreshSchema = Joi.object({
  refreshToken: Joi.string().required()
});
