import Joi from "joi";

export const updateProfileSchema = Joi.object({
  bio: Joi.string().max(500).allow("").optional(),
  cvUrl: Joi.string().uri().optional(),
  linkedinUrl: Joi.string().uri().optional(),
  portfolioUrl: Joi.string().uri().optional(),
  specialties: Joi.array().items(Joi.string().hex().length(24)).optional(),
});

export const userIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});
