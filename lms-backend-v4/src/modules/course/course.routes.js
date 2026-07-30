import express from "express";
const router = express.Router();

import validation from "../../middleware/validation.js";
import { protect, allowedTo } from "../../middleware/auth.js";
import { uploadThumbnail, uploadMedia } from "../../middleware/uploadMiddleware.js";
import { createCourseSchema, updateCourseSchema, courseIdSchema } from "./course.validation.js";

import createCourse from "./courseModules/CreateCourse.modules.js";
import getCourses from "./courseModules/GetCourses.modules.js";
import getMyCourses from "./courseModules/GetMyCourses.modules.js";
import getCourse from "./courseModules/GetCourse.modules.js";
import updateCourse from "./courseModules/UpdateCourse.modules.js";
import deleteCourse from "./courseModules/DeleteCourse.modules.js";
import addGalleryItem from "./courseModules/AddGalleryItem.modules.js";
import deleteGalleryItem from "./courseModules/DeleteGalleryItem.modules.js";

router
  .route("/")
  .get(getCourses)
  .post(
    protect,
    allowedTo("instructor", "admin"),
    uploadThumbnail.single("thumbnail"),
    validation(createCourseSchema),
    createCourse
  );

router.get("/my", protect, allowedTo("instructor", "admin"), getMyCourses);

router
  .route("/:id")
  .get(validation(courseIdSchema), getCourse)
  .put(protect, allowedTo("instructor", "admin"), validation(updateCourseSchema), updateCourse)
  .delete(protect, allowedTo("instructor", "admin"), validation(courseIdSchema), deleteCourse);

router.post(
  "/:id/gallery",
  protect,
  allowedTo("instructor", "admin"),
  uploadMedia.single("media"),
  addGalleryItem
);
router.delete("/:id/gallery/:itemId", protect, allowedTo("instructor", "admin"), deleteGalleryItem);

export default router;