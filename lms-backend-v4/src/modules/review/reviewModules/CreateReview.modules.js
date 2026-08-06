import Review from "../../../../database/models/review.model.js";
import Enrollment from "../../../../database/models/enrollment.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import recalculateCourseRating from "../../../utils/recalculateCourseRating.js";

const createReview = catchError(async (req, res, next) => {
  const enrollment = await Enrollment.findOne({
    user: req.user._id,
    course: req.body.courseId,
  });
  if (!enrollment) {
    return next(new AppError("لازم تكون مسجل في الكورس عشان تقيّمه", 403));
  }
  if (enrollment.status !== "completed" && (enrollment.progressPercent || 0) < 100) {
    return next(new AppError("قيّم الكورس بعد ما تكمّله", 403));
  }

  const existingReview = await Review.findOne({
    user: req.user._id,
    course: req.body.courseId,
  });
  if (existingReview) {
    return next(
      new AppError("إنت قيّمت الكورس ده قبل كده، تقدر تعدّل تقييمك بدل ما تعمل واحد جديد", 400)
    );
  }

  const review = await Review.create({
    user: req.user._id,
    course: req.body.courseId,
    rating: req.body.rating,
    comment: req.body.comment,
  });

  await recalculateCourseRating(req.body.courseId);

  res.status(201).json({ status: "success", data: review });
});

export default createReview;
