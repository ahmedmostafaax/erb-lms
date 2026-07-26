import Joi from "joi";

export const createCategorySchema = Joi.object({
  name: Joi.string().min(2).max(50).required(),
  parent: Joi.string().hex().length(24).optional().allow(null),
});

export const updateCategorySchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  name: Joi.string().min(2).max(50).optional(),
  parent: Joi.string().hex().length(24).optional().allow(null),
});

export const categoryIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
