import Course from "../../../../database/models/course.model.js";
import User from "../../../../database/models/user.model.js";
import catchError from "../../../middleware/catchError.js";
import ApiFeature from "../../../utils/ApiFeature.js";

const getCourses = catchError(async (req, res, next) => {
  const filter = { status: "published" };

  if (req.query.price === "free") filter.price = 0;
  if (req.query.price === "paid") filter.price = { $gt: 0 };
  if (req.query.minRating) filter.ratingAvg = { $gte: Number(req.query.minRating) };

  // price و minRating مش حقول ApiFeature العادية بنفس الشكل — امسحهم من query
  delete req.query.price;
  delete req.query.minRating;

  if (req.query.keyword) {
    const keyword = req.query.keyword;
    const instructors = await User.find({
      role: { $in: ["instructor", "admin"] },
      name: { $regex: keyword, $options: "i" },
    }).select("_id");

    const instructorIds = instructors.map((u) => u._id);

    filter.$or = [
      { title: { $regex: keyword, $options: "i" } },
      { description: { $regex: keyword, $options: "i" } },
      { instructor: { $in: instructorIds } },
    ];

    delete req.query.keyword;
  }

  const baseQuery = Course.find(filter)
    .populate("instructor", "name avatarUrl")
    .populate("category", "name slug");

  const apiFeature = new ApiFeature(baseQuery, req.query)
    .filter()
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
