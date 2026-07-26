import { Question } from "../../../../database/models/community.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const deleteQuestion = catchError(async (req, res, next) => {
  const question = await Question.findById(req.params.id);
  if (!question) return next(new AppError("السؤال غير موجود", 404));

  const isOwner = question.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return next(new AppError("مالكش صلاحية تحذف السؤال ده", 403));
  }

  await question.deleteOne();
  res.status(200).json({ status: "success", message: "تم حذف السؤال بنجاح" });
});

export default deleteQuestion;