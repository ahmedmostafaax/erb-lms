import Joi from "joi";

export const createReviewSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).required(),
  comment: Joi.string().max(1000).allow("").optional(),
});

export const updateReviewSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  rating: Joi.number().min(1).max(5).optional(),
  comment: Joi.string().max(1000).allow("").optional(),
});

export const reviewIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});