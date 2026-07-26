import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import checkOwnership from "../../../utils/checkOwnership.js";

const updateModule = catchError(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return next(new AppError("الكورس غير موجود", 404));

  if (!checkOwnership(course.instructor, req.user)) {
    return next(new AppError("مالكش صلاحية تعدّل محتوى الكورس ده", 403));
  }

  const moduleItem = course.modules.id(req.params.moduleId);
  if (!moduleItem) return next(new AppError("الموديول غير موجود", 404));

  if (req.body.title !== undefined) moduleItem.title = req.body.title;
  if (req.body.order !== undefined) moduleItem.order = req.body.order;

  await course.save();
  res.status(200).json({ status: "success", data: moduleItem });
});

export default updateModule;