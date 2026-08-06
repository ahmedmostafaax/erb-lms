import { Submission, Quiz } from "../../../../database/models/assessment.model.js";
import Course from "../../../../database/models/course.model.js";
import Notification from "../../../../database/models/notification.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import checkOwnership from "../../../utils/checkOwnership.js";

const gradeSubmission = catchError(async (req, res, next) => {
  const submission = await Submission.findById(req.params.id);
  if (!submission) return next(new AppError("التسليم غير موجود", 404));

  const quiz = await Quiz.findById(submission.quiz);
  const course = await Course.findById(quiz.course);
  if (!checkOwnership(course.instructor, req.user)) {
    return next(new AppError("مالكش صلاحية تصحح التسليم ده", 403));
  }

  const maxScore = quiz.questions.reduce((sum, q) => sum + (q.points || 1), 0);

  if (req.body.score > maxScore) {
    return next(new AppError(`الدرجة لا يمكن أن تتجاوز ${maxScore}`, 400));
  }

  submission.result = {
    score: req.body.score,
    maxScore,
    feedback: req.body.feedback,
    gradedAt: Date.now(),
  };
  submission.status = "graded";
  await submission.save();

  try {
    await Notification.create({
      user: submission.user,
      type: "system",
      message: `تم تصحيح اختبارك: ${quiz.title} — الدرجة ${req.body.score}/${maxScore}`,
      link: `/quiz/${quiz._id}`,
    });
  } catch {}

  res.status(200).json({ status: "success", data: submission });
});

export default gradeSubmission;
