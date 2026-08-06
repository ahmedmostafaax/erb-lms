import Enrollment from "../../../../database/models/enrollment.model.js";
import Course from "../../../../database/models/course.model.js";
import Notification from "../../../../database/models/notification.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const enrollCourse = catchError(async (req, res, next) => {
  const course = await Course.findById(req.body.courseId);
  if (!course || course.status !== "published") {
    return next(new AppError("الكورس غير موجود أو غير متاح للتسجيل", 404));
  }

  const existing = await Enrollment.findOne({ user: req.user._id, course: course._id });
  if (existing) {
    return next(new AppError("إنت مسجل في الكورس ده بالفعل", 400));
  }

  const enrollment = await Enrollment.create({
    user: req.user._id,
    course: course._id,
  });

  course.enrollmentCount += 1;
  await course.save();

  try {
    await Notification.create({
      user: course.instructor,
      type: "enrollment",
      message: `طالب جديد انضم لكورس: ${course.title}`,
      link: `/instructor/courses/${course._id}/manage`,
    });
  } catch {}

  res.status(201).json({ status: "success", data: enrollment });
});

export default enrollCourse;
