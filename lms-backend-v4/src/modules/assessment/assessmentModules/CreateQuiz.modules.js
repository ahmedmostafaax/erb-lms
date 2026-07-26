import { Quiz } from "../../../../database/models/assessment.model.js";
import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import checkOwnership from "../../../utils/checkOwnership.js";

const createQuiz = catchError(async (req, res, next) => {
  const course = await Course.findById(req.body.courseId);
  if (!course) return next(new AppError("الكورس غير موجود", 404));

  if (!checkOwnership(course.instructor, req.user)) {
    return next(new AppError("مالكش صلاحية تضيف اختبار للكورس ده", 403));
  }

  const quiz = await Quiz.create({
    course: req.body.courseId,
    lessonId: req.body.lessonId || null,
    title: req.body.title,
    type: req.body.type,
    durationMinutes: req.body.durationMinutes,
    questions: req.body.questions,
  });

  res.status(201).json({ status: "success", data: quiz });
});

export default createQuiz;