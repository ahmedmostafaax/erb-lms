import Course from "../../../../database/models/course.model.js";
import Review from "../../../../database/models/review.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const getCourse = catchError(async (req, res, next) => {
  const course = await Course.findById(req.params.id)
    .populate("instructor", "name avatarUrl profile.bio")
    .populate("category", "name slug");

  if (!course) return next(new AppError("الكورس غير موجود", 404));

  const reviews = await Review.find({ course: course._id })
    .populate("user", "name avatarUrl")
    .sort("-createdAt")
    .limit(10);

  res.status(200).json({ status: "success", data: { course, reviews } });
});

export default getCourse;
