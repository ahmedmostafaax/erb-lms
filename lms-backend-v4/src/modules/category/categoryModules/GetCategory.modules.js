import Category from "../../../../database/models/category.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const getCategory = catchError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  if (!category) return next(new AppError("التصنيف غير موجود", 404));

  res.status(200).json({ status: "success", data: category });
});

export default getCategory;
