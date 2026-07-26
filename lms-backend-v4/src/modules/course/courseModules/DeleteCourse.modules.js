import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import clearCache from "../../../utils/clearCache.js";

const deleteCourse = catchError(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError("الكورس غير موجود", 404));

  const isOwner = course.instructor.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return next(new AppError("مالكش صلاحية تحذف الكورس ده", 403));
  }

  await course.deleteOne();

  await clearCache("courses");

  res.status(200).json({ status: "success", message: "تم حذف الكورس بنجاح" });
});

export default deleteCourse;