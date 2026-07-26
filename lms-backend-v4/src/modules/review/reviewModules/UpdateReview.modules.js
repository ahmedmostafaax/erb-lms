import Review from "../../../../database/models/review.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import recalculateCourseRating from "../../../utils/recalculateCourseRating.js";

const updateReview = catchError(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  if (!review) return next(new AppError("التقييم غير موجود", 404));

  if (review.user.toString() !== req.user._id.toString()) {
    return next(new AppError("مالكش صلاحية تعدّل التقييم ده", 403));
  }

  if (req.body.rating !== undefined) review.rating = req.body.rating;
  if (req.body.comment !== undefined) review.comment = req.body.comment;
  await review.save();

  await recalculateCourseRating(review.course);

  res.status(200).json({ status: "success", data: review });
});

export default updateReview;