import Joi from "joi";

export const updateProfileSchema = {
  body: Joi.object({
    bio: Joi.string().allow("").optional(),
    cvUrl: Joi.string().allow("").optional(),
    linkedinUrl: Joi.string().allow("").optional(),
    portfolioUrl: Joi.string().allow("").optional(),
    specialties: Joi.array().items(Joi.string()).optional(),
    experienceYears: Joi.number().min(0).optional(),
    education: Joi.string().allow("").optional(),
    certifications: Joi.string().allow("").optional(),
    age: Joi.number().min(10).max(120).optional(),
  }).unknown(false),
};

export const userIdSchema = {
  params: Joi.object({
    id: Joi.string().hex().length(24).required(),
  }),
};
