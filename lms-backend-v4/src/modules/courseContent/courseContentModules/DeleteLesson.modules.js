import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import checkOwnership from "../../../utils/checkOwnership.js";

const deleteLesson = catchError(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return next(new AppError("الكورس غير موجود", 404));

  if (!checkOwnership(course.instructor, req.user)) {
    return next(new AppError("مالكش صلاحية تعدّل محتوى الكورس ده", 403));
  }

  const moduleItem = course.modules.id(req.params.moduleId);
  if (!moduleItem) return next(new AppError("الموديول غير موجود", 404));

  const lesson = moduleItem.lessons.id(req.params.lessonId);
  if (!lesson) return next(new AppError("الدرس غير موجود", 404));

  moduleItem.lessons.pull(req.params.lessonId);
  await course.save();

  res.status(200).json({ status: "success", message: "تم حذف الدرس بنجاح" });
});

export default deleteLesson;