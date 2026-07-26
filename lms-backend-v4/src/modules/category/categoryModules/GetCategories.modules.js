import Category from "../../../../database/models/category.model.js";
import catchError from "../../../middleware/catchError.js";
import ApiFeature from "../../../utils/ApiFeature.js";

const getCategories = catchError(async (req, res, next) => {
  const apiFeature = new ApiFeature(Category.find(), req.query)
    .filter()
    .search(["name"])
    .sort()
    .select()
    .paginate();

  const categories = await apiFeature.mongooseQuery.lean();

  res.status(200).json({
    status: "success",
    results: categories.length,
    page: apiFeature.paginationResult.currentPage,
    data: categories,
  });
});

export default getCategories;