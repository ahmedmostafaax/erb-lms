import Review from "../../../../database/models/review.model.js";
import catchError from "../../../middleware/catchError.js";
import ApiFeature from "../../../utils/ApiFeature.js";

const getCourseReviews = catchError(async (req, res, next) => {
  const baseQuery = Review.find({ course: req.params.courseId }).populate("user", "name avatarUrl");

  const apiFeature = new ApiFeature(baseQuery, req.query).sort().paginate();
  const reviews = await apiFeature.mongooseQuery;

  res.status(200).json({
    status: "success",
    results: reviews.length,
    page: apiFeature.paginationResult.currentPage,
    data: reviews,
  });
});

export default getCourseReviews;