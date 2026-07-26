import Joi from "joi";

export const createPostSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
  content: Joi.string().min(1).max(2000).required(),
});

export const postIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const addCommentSchema = Joi.object({
  id: Joi.string().hex().length(24).required(), // postId
  content: Joi.string().min(1).max(1000).required(),
});

export const createQuestionSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
  title: Joi.string().min(3).max(200).required(),
  body: Joi.string().min(1).max(2000).required(),
});

export const questionIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const addAnswerSchema = Joi.object({
  id: Joi.string().hex().length(24).required(), // questionId
  body: Joi.string().min(1).max(2000).required(),
});