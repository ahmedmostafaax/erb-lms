import { Quiz } from "../../../../database/models/assessment.model.js";
import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import checkOwnership from "../../../utils/checkOwnership.js";

const updateQuiz = catchError(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return next(new AppError("الاختبار غير موجود", 404));

  const course = await Course.findById(quiz.course);
  if (!checkOwnership(course.instructor, req.user)) {
    return next(new AppError("مالكش صلاحية تعدّل الاختبار ده", 403));
  }

  ["title", "type", "durationMinutes", "questions"].forEach((field) => {
    if (req.body[field] !== undefined) quiz[field] = req.body[field];
  });

  await quiz.save();
  res.status(200).json({ status: "success", data: quiz });
});

export default updateQuiz;