import Joi from "joi";

export const moduleParamsSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
  moduleId: Joi.string().hex().length(24).optional(),
});

export const createModuleSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
  title: Joi.string().min(2).max(150).required(),
  order: Joi.number().min(0).required(),
});

export const updateModuleSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
  moduleId: Joi.string().hex().length(24).required(),
  title: Joi.string().min(2).max(150).optional(),
  order: Joi.number().min(0).optional(),
});

export const lessonParamsSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
  moduleId: Joi.string().hex().length(24).required(),
  lessonId: Joi.string().hex().length(24).optional(),
});

export const createLessonSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
  moduleId: Joi.string().hex().length(24).required(),
  title: Joi.string().min(2).max(150).required(),
  videoUrl: Joi.string().uri().optional(),
  durationSeconds: Joi.number().min(0).optional(),
  order: Joi.number().min(0).required(),
});

export const updateLessonSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
  moduleId: Joi.string().hex().length(24).required(),
  lessonId: Joi.string().hex().length(24).required(),
  title: Joi.string().min(2).max(150).optional(),
  videoUrl: Joi.string().uri().optional(),
  durationSeconds: Joi.number().min(0).optional(),
  order: Joi.number().min(0).optional(),
});