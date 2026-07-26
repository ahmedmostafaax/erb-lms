import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import ApiFeature from "../../../utils/ApiFeature.js";

const getCourses = catchError(async (req, res, next) => {
  const baseQuery = Course.find({ status: "published" })
    .populate("instructor", "name avatarUrl")
    .populate("category", "name slug");

  const apiFeature = new ApiFeature(baseQuery, req.query)
    .filter()
    .search(["title", "description"])
    .sort()
    .select()
    .paginate();

  const courses = await apiFeature.mongooseQuery.lean();

  res.status(200).json({
    status: "success",
    results: courses.length,
    page: apiFeature.paginationResult.currentPage,
    data: courses,
  });
});

export default getCourses;