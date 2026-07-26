import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";

// بيرجّع كل كورسات المدرب (بما فيها الـ draft)، عكس GetCourses اللي بيرجّع المنشورة بس
const getMyCourses = catchError(async (req, res, next) => {
  const courses = await Course.find({ instructor: req.user._id })
    .populate("category", "name slug")
    .sort("-createdAt");

  res.status(200).json({ status: "success", results: courses.length, data: courses });
});

export default getMyCourses;
