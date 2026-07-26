import { Quiz } from "../../../../database/models/assessment.model.js";
import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import checkOwnership from "../../../utils/checkOwnership.js";

const getQuiz = catchError(async (req, res, next) => {
  const quiz = await Quiz.findById(req.params.id);
  if (!quiz) return next(new AppError("الاختبار غير موجود", 404));

  const course = await Course.findById(quiz.course);
  const isOwner = checkOwnership(course.instructor, req.user);

  const quizData = quiz.toObject();
  if (!isOwner) {
    quizData.questions = quizData.questions.map(({ correctAnswer, ...rest }) => rest);
  }

  res.status(200).json({ status: "success", data: quizData });
});

export default getQuiz;