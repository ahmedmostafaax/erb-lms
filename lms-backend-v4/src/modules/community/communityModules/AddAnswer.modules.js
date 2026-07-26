import { Question } from "../../../../database/models/community.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import checkEnrollment from "../../../utils/checkEnrollment.js";

const addAnswer = catchError(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  if (!question) return next(new AppError("السؤال غير موجود", 404));

  await checkEnrollment(question.course, req.user);

  question.answers.push({ user: req.user._id, body: req.body.body });
  await question.save();

  res.status(201).json({ status: "success", data: question.answers[question.answers.length - 1] });
});

export default addAnswer;