import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import checkOwnership from "../../../utils/checkOwnership.js";

const deleteModule = catchError(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return next(new AppError("الكورس غير موجود", 404));

  if (!checkOwnership(course.instructor, req.user)) {
    return next(new AppError("مالكش صلاحية تعدّل محتوى الكورس ده", 403));
  }

  const moduleItem = course.modules.id(req.params.moduleId);
  if (!moduleItem) return next(new AppError("الموديول غير موجود", 404));

  course.modules.pull(req.params.moduleId);
  await course.save();

  res.status(200).json({ status: "success", message: "تم حذف الموديول بنجاح" });
});

export default deleteModule;