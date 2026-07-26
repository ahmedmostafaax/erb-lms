import Joi from "joi";

export const updatePersonalDataSchema = Joi.object({
  name: Joi.string().min(2).max(50).optional(),
  phone: Joi.string().optional(),
  avatarUrl: Joi.string().uri().optional(),
});

export const changePasswordSchema = Joi.object({
  currentPassword: Joi.string().required(),
  newPassword: Joi.string().min(6).required(),
});

export const updateSettingsSchema = Joi.object({
  notificationsEnabled: Joi.boolean().optional(),
  privacyLevel: Joi.string().valid("public", "private").optional(),
  language: Joi.string().optional(),
});