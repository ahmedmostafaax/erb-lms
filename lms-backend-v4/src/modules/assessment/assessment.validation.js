import Joi from "joi";

const questionSchema = Joi.object({
  text: Joi.string().min(1).required(),
  type: Joi.string().valid("mcq", "truefalse", "essay", "upload").required(),
  options: Joi.array().items(Joi.string()).optional(),
  correctAnswer: Joi.string().optional(),
  points: Joi.number().min(1).optional(),
});

export const createQuizSchema = Joi.object({
  courseId: Joi.string().hex().length(24).required(),
  lessonId: Joi.string().hex().length(24).optional().allow(null),
  title: Joi.string().min(2).max(150).required(),
  type: Joi.string().valid("quiz", "exam", "task").required(),
  durationMinutes: Joi.number().min(1).optional(),
  questions: Joi.array().items(questionSchema).min(1).required(),
});

export const quizIdSchema = Joi.object({
  id: Joi.string().hex().length(24).required(),
});

export const submitQuizSchema = Joi.object({
  id: Joi.string().hex().length(24).required(), // quizId
  answers: Joi.array()
    .items(
      Joi.object({
        questionId: Joi.string().hex().length(24).required(),
        answer: Joi.string().allow("").required(),
      })
    )
    .required(),
  fileUrl: Joi.string().uri().optional(),
});

export const gradeSubmissionSchema = Joi.object({
  id: Joi.string().hex().length(24).required(), // submissionId
  score: Joi.number().min(0).required(),
  feedback: Joi.string().max(1000).allow("").optional(),
});