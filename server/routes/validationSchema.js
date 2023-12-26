const Joi = require("joi");
const registerSchema = Joi.object({
  userName: Joi.string().max(20).required(),
  email: Joi.string().email().required(),
  confirmPassword: Joi.string().min(5).max(20).required(),
  password: Joi.string().min(5).max(20).required(),
  address: Joi.string().min(4).max(20).required(),
  gender: Joi.string().valid("male", "female"),
  age: Joi.number().min(5).max(200).required(),
});
const loginSchema = Joi.object({
  email: Joi.string().email().required("mail is req"),
  password: Joi.string().min(5).max(20).required("password is required"),
});
const userDetailSchema = Joi.object({
  userName: Joi.string()
    .min(3)
    .max(20)
    .optional()
    .description("username is required"),
  address: Joi.string().min(3).optional().description("address is required"),
  gender: Joi.string()
    .valid("male", "female")
    .optional()
    .description("gender is required"),
  age: Joi.number().min(5).max(200).optional().description("age is required"),
  old_imgPath: Joi.string()
    .optional()
    .description("old image path is required"),
});
module.exports = { registerSchema, loginSchema, userDetailSchema };
