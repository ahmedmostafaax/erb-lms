import Enrollment from "../../database/models/enrollment.model.js";
import Course from "../../database/models/course.model.js";
import AppError from "./AppError.js";

const checkEnrollment = async (courseId, user) => {
  const course = await Course.findById(courseId);
  if (!course) throw new AppError("الكورس غير موجود", 404);

  const isOwner = course.instructor.toString() === user._id.toString();
  if (isOwner || user.role === "admin") return; // المدرب وصاحب الكورس والأدمن مسموحلهم دايمًا

  const enrollment = await Enrollment.findOne({ user: user._id, course: courseId });
  if (!enrollment) throw new AppError("لازم تكون مسجل في الكورس عشان تشارك في مجتمعه", 403);
};

export default checkEnrollment;