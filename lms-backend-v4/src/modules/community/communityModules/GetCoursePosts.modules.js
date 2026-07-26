import { Post } from "../../../../database/models/community.model.js";
import catchError from "../../../middleware/catchError.js";
import ApiFeature from "../../../utils/ApiFeature.js";

const getCoursePosts = catchError(async (req, res, next) => {
  const baseQuery = Post.find({ course: req.params.courseId })
    .populate("user", "name avatarUrl")
    .populate("comments.user", "name avatarUrl");

  const apiFeature = new ApiFeature(baseQuery, req.query).sort().paginate();
  const posts = await apiFeature.mongooseQuery;

  res.status(200).json({
    status: "success",
    results: posts.length,
    page: apiFeature.paginationResult.currentPage,
    data: posts,
  });
});

export default getCoursePosts;