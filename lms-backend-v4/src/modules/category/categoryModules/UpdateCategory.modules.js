import Category from "../../../../database/models/category.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import slugify from "../../../utils/slugify.js";

const updateCategory = catchError(async (req, res, next) => {
  const updateData = { ...req.body };
  if (updateData.name) {
    updateData.slug = slugify(updateData.name);
  }

  const category = await Category.findByIdAndUpdate(req.params.id, updateData, {
    new: true,
    runValidators: true,
  });

  if (!category) return next(new AppError("التصنيف غير موجود", 404));

  res.status(200).json({ status: "success", data: category });
});

export default updateCategory;
