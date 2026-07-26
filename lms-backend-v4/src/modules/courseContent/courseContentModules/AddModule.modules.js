import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import checkOwnership from "../../../utils/checkOwnership.js";

const addModule = catchError(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return next(new AppError("الكورس غير موجود", 404));

  if (!checkOwnership(course.instructor, req.user)) {
    return next(new AppError("مالكش صلاحية تعدّل محتوى الكورس ده", 403));
  }

  course.modules.push({ title: req.body.title, order: req.body.order, lessons: [] });
  await course.save();

  res.status(201).json({ status: "success", data: course.modules[course.modules.length - 1] });
});

export default addModule;