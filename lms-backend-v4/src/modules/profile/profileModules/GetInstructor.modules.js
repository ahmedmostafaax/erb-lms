import User from "../../../../database/models/user.model.js";
import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const getInstructor = catchError(async (req, res, next) => {
  const instructor = await User.findById(req.params.id).select(
    "name avatarUrl role profile createdAt"
  );
  if (!instructor || !["instructor", "admin"].includes(instructor.role)) {
    return next(new AppError("المدرّس غير موجود", 404));
  }

  const courses = await Course.find({
    instructor: instructor._id,
    status: "published",
  }).select("title price level ratingAvg ratingCount enrollmentCount thumbnailUrl");

  const studentsCount = courses.reduce((s, c) => s + (c.enrollmentCount || 0), 0);
  const rated = courses.filter((c) => (c.ratingCount || 0) > 0);
  const avgRating =
    rated.length > 0
      ? rated.reduce((s, c) => s + c.ratingAvg, 0) / rated.length
      : 0;

  res.json({
    status: "success",
    data: {
      instructor,
      courses,
      stats: {
        coursesCount: courses.length,
        studentsCount,
        avgRating: Math.round(avgRating * 10) / 10,
      },
    },
  });
});

export default getInstructor;
