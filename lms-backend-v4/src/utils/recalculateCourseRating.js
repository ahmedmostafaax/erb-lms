import Review from "../../database/models/review.model.js";
import Course from "../../database/models/course.model.js";

const recalculateCourseRating = async (courseId) => {
  const stats = await Review.aggregate([
    { $match: { course: courseId } },
    {
      $group: {
        _id: "$course",
        avgRating: { $avg: "$rating" },
        count: { $sum: 1 },
      },
    },
  ]);

  const ratingAvg = stats.length > 0 ? Math.round(stats[0].avgRating * 10) / 10 : 0;
  const ratingCount = stats.length > 0 ? stats[0].count : 0;

  await Course.findByIdAndUpdate(courseId, { ratingAvg, ratingCount });
};

export default recalculateCourseRating;