import { Question } from "../../../../database/models/community.model.js";
import catchError from "../../../middleware/catchError.js";
import ApiFeature from "../../../utils/ApiFeature.js";

const getCourseQuestions = catchError(async (req, res, next) => {
  const baseQuery = Question.find({ course: req.params.courseId })
    .populate("user", "name avatarUrl")
    .populate("answers.user", "name avatarUrl");

  const apiFeature = new ApiFeature(baseQuery, req.query).search(["title", "body"]).sort().paginate();
  const questions = await apiFeature.mongooseQuery;

  res.status(200).json({
    status: "success",
    results: questions.length,
    page: apiFeature.paginationResult.currentPage,
    data: questions,
  });
});

export default getCourseQuestions;