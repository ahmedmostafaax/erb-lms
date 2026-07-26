import express from "express";
const router = express.Router();

import validation from "../../middleware/validation.js";
import { protect, allowedTo } from "../../middleware/auth.js";
import { uploadImage } from "../../middleware/uploadMiddleware.js";
import { createCourseSchema, updateCourseSchema, courseIdSchema } from "./course.validation.js";

import createCourse from "./courseModules/CreateCourse.modules.js";
import getCourses from "./courseModules/GetCourses.modules.js";
import getMyCourses from "./courseModules/GetMyCourses.modules.js";
import getCourse from "./courseModules/GetCourse.modules.js";
import updateCourse from "./courseModules/UpdateCourse.modules.js";
import deleteCourse from "./courseModules/DeleteCourse.modules.js";

router
  .route("/")
  .get(getCourses)
  .post(
    protect,
    allowedTo("instructor", "admin"),
    uploadImage.single("thumbnail"),
    validation(createCourseSchema),
    createCourse
  );

// لازم يفضل قبل route الـ /:id عشان "my" متتفسرش كـ id غلط
router.get("/my", protect, allowedTo("instructor", "admin"), getMyCourses);

router
  .route("/:id")
  .get(validation(courseIdSchema), getCourse)
  .put(protect, allowedTo("instructor", "admin"), validation(updateCourseSchema), updateCourse)
  .delete(protect, allowedTo("instructor", "admin"), validation(courseIdSchema), deleteCourse);

export default router;
