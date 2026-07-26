import Course from "../../../../database/models/course.model.js";
import Enrollment from "../../../../database/models/enrollment.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import checkOwnership from "../../../utils/checkOwnership.js";

const getCourseContent = catchError(async (req, res, next) => {
  const course = await Course.findById(req.params.courseId);
  if (!course) return next(new AppError("الكورس غير موجود", 404));

  const isOwner = checkOwnership(course.instructor, req.user);

  if (!isOwner) {
    const enrollment = await Enrollment.findOne({ user: req.user._id, course: course._id });
    if (!enrollment) {
      return next(new AppError("لازم تكون مسجل في الكورس عشان تشوف محتواه", 403));
    }
  }

  res.status(200).json({ status: "success", data: course.modules });
});

export default getCourseContent;