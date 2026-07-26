import { Quiz, Submission } from "../../../../database/models/assessment.model.js";
import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import checkOwnership from "../../../utils/checkOwnership.js";

const getQuizSubmissions = catchError(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return next(new AppError("الاختبار غير موجود", 404));

  const course = await Course.findById(quiz.course);
  if (!checkOwnership(course.instructor, req.user)) {
    return next(new AppError("مالكش صلاحية تشوف تسليمات الاختبار ده", 403));
  }

  const submissions = await Submission.find({ quiz: quiz._id }).populate("user", "name avatarUrl");
  res.status(200).json({ status: "success", results: submissions.length, data: submissions });
});

export default getQuizSubmissions;