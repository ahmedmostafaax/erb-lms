import express from "express";
const router = express.Router({ mergeParams: true }); // مهم: عشان ياخد courseId من الـ URL الأب

import validation from "../../middleware/validation.js";
import { protect } from "../../middleware/auth.js";
import {
  createModuleSchema,
  updateModuleSchema,
  moduleParamsSchema,
  createLessonSchema,
  updateLessonSchema,
  lessonParamsSchema,
} from "./courseContent.validation.js";

import getCourseContent from "./courseContentModules/GetCourseContent.modules.js";
import addModule from "./courseContentModules/AddModule.modules.js";
import updateModule from "./courseContentModules/UpdateModule.modules.js";
import deleteModule from "./courseContentModules/DeleteModule.modules.js";
import addLesson from "./courseContentModules/AddLesson.modules.js";
import updateLesson from "./courseContentModules/UpdateLesson.modules.js";
import deleteLesson from "./courseContentModules/DeleteLesson.modules.js";
import { uploadVideo } from "../../middleware/uploadMiddleware.js";

router.use(protect); // كل حاجة هنا محتاجة تسجيل دخول

router.get("/content", getCourseContent);

router.post("/modules", validation(createModuleSchema), addModule);
router.put("/modules/:moduleId", validation(updateModuleSchema), updateModule);
router.delete("/modules/:moduleId", validation(moduleParamsSchema), deleteModule);

router.post(
  "/modules/:moduleId/lessons",
  uploadVideo.single("video"),
  validation(createLessonSchema),
  addLesson
);
router.put("/modules/:moduleId/lessons/:lessonId", validation(updateLessonSchema), updateLesson);
router.delete("/modules/:moduleId/lessons/:lessonId", validation(lessonParamsSchema), deleteLesson);

export default router;