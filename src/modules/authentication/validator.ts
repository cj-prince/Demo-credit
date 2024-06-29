import Joi from "joi";

export const registerValidatorSchema = Joi.object({
  first_name: Joi.string().required(),
  last_name: Joi.string().required(),
  email: Joi.string().required().email().messages({
    "string.pattern.base": "Please enter a valid email.",
    "string.empty": "Email is not allowed to be empty",
  }),
  username: Joi.string().required(),
  phone_number: Joi.string()
    .required()
    .pattern(/^\d{10,14}$/)
    .required(),
  password: Joi.string().min(6).required(),
  terms_and_conditions: Joi.boolean().required(),
  country: Joi.string(),
});
export const loginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().required(),
});

export const otpSchema = Joi.object({
  email: Joi.string().email().required(),
  otp: Joi.string().required(),
});
