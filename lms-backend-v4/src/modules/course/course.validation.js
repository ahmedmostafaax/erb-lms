import Joi from "joi";

export const createCourseSchema = Joi.object({
  title: Joi.string().min(3).max(150).required(),
  description: Joi.string().min(10).required(),
  category: Joi.string().hex().length(24).required(),
  price: Joi.number().min(0).required(),
  level: Joi.string().valid("beginner", "intermediate", "advanced").optional(),
  language: Joi.string().optional(),
  thumbnailUrl: Joi.string().uri().optional(),
});

export const updateCourseSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  title: Joi.string().min(3).max(150).optional(),
  description: Joi.string().min(10).optional(),
  category: Joi.string().hex().length(24).optional(),
  price: Joi.number().min(0).optional(),
  level: Joi.string().valid("beginner", "intermediate", "advanced").optional(),
  language: Joi.string().optional(),
  thumbnailUrl: Joi.string().uri().optional(),
  status: Joi.string().valid("draft", "published", "archived").optional(),
});

export const courseIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
