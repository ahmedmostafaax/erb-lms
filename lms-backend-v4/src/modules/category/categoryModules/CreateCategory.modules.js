import Category from "../../../../database/models/category.model.js";
import catchError from "../../../middleware/catchError.js";
import slugify from "../../../utils/slugify.js";

const createCategory = catchError(async (req, res, next) => {
  const category = await Category.create({
    name: req.body.name,
    slug: slugify(req.body.name),
    parent: req.body.parent || null,
  });

  res.status(201).json({ status: "success", data: category });
});

export default createCategory;
