import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import checkOwnership from "../../../utils/checkOwnership.js";
import uploadToCloudinary from "../../../utils/uploadToCloudinary.js";

const addLesson = catchError(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return next(new AppError("الكورس غير موجود", 404));

  if (!checkOwnership(course.instructor, req.user)) {
    return next(new AppError("مالكش صلاحية تعدّل محتوى الكورس ده", 403));
  }

  const moduleItem = course.modules.id(req.params.moduleId);
  if (!moduleItem) return next(new AppError("الموديول غير موجود", 404));

  let videoUrl;
  let durationSeconds = req.body.durationSeconds || 0;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "lessons", "video");
    videoUrl = result.secure_url;
    durationSeconds = Math.round(result.duration) || durationSeconds; // Cloudinary بيرجع مدة الفيديو تلقائيًا
  }

  moduleItem.lessons.push({
    title: req.body.title,
    videoUrl,
    durationSeconds,
    order: req.body.order,
  });

  await course.save();
  res.status(201).json({
    status: "success",
    data: moduleItem.lessons[moduleItem.lessons.length - 1],
  });
});

export default addLesson;