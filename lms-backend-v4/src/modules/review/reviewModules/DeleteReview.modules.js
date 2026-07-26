import Review from "../../../../database/models/review.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import recalculateCourseRating from "../../../utils/recalculateCourseRating.js";

const deleteReview = catchError(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError("التقييم غير موجود", 404));

  const isOwner = review.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return next(new AppError("مالكش صلاحية تحذف التقييم ده", 403));
  }

  const courseId = review.course;
  await review.deleteOne();
  await recalculateCourseRating(courseId);

  res.status(200).json({ status: "success", message: "تم حذف التقييم بنجاح" });
});

export default deleteReview;