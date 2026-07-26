import { Quiz, Submission } from "../../../../database/models/assessment.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const submitQuiz = catchError(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return next(new AppError("الاختبار غير موجود", 404));

  const existing = await Submission.findOne({ quiz: quiz._id, user: req.user._id });
  if (existing) return next(new AppError("إنت سلّمت الاختبار ده قبل كده", 400));

  let autoScore = 0;
  let maxScore = 0;
  let needsManualGrading = false;

  quiz.questions.forEach((q) => {
    maxScore += q.points || 1;
    const submittedAnswer = req.body.answers.find((a) => a.questionId === q._id.toString());

    if (q.type === "mcq" || q.type === "truefalse") {
      if (submittedAnswer && submittedAnswer.answer === q.correctAnswer) {
        autoScore += q.points || 1;
      }
    } else {
      needsManualGrading = true; // essay/upload محتاجين تصحيح يدوي
    }
  });

  const submission = await Submission.create({
    quiz: quiz._id,
    user: req.user._id,
    answers: req.body.answers,
    fileUrl: req.body.fileUrl,
    status: needsManualGrading ? "submitted" : "graded",
    result: needsManualGrading
      ? null
      : { score: autoScore, maxScore, gradedAt: Date.now() },
  });

  res.status(201).json({ status: "success", data: submission });
});

export default submitQuiz;