import express from "express";
const router = express.Router();

import validation from "../../middleware/validation.js";
import { protect, allowedTo } from "../../middleware/auth.js";
import { createCategorySchema, updateCategorySchema, categoryIdSchema } from "./category.validation.js";

import createCategory from "./categoryModules/CreateCategory.modules.js";
import getCategories from "./categoryModules/GetCategories.modules.js";
import getCategory from "./categoryModules/GetCategory.modules.js";
import updateCategory from "./categoryModules/UpdateCategory.modules.js";
import deleteCategory from "./categoryModules/DeleteCategory.modules.js";

router
  .route("/")
  .get(getCategories)
  .post(protect, allowedTo("admin"), validation(createCategorySchema), createCategory);

router
  .route("/:id")
  .get(validation(categoryIdSchema), getCategory)
  .put(protect, allowedTo("admin"), validation(updateCategorySchema), updateCategory)
  .delete(protect, allowedTo("admin"), validation(categoryIdSchema), deleteCategory);

export default router;
