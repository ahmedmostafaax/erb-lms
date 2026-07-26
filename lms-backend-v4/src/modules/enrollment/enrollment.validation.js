import Joi from "joi";

export const enrollCourseSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
});

export const enrollmentIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const updateProgressSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
  lessonId: Joi.string().hex().length(24).required(),
});
