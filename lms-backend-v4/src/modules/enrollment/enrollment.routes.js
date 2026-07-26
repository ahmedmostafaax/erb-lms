import express from "express";
const router = express.Router();

import validation from "../../middleware/validation.js";
import { protect } from "../../middleware/auth.js";
import { enrollCourseSchema, enrollmentIdSchema, updateProgressSchema } from "./enrollment.validation.js";

import enrollCourse from "./enrollmentModules/EnrollCourse.modules.js";
import getMyEnrollments from "./enrollmentModules/GetMyEnrollments.modules.js";
import getEnrollment from "./enrollmentModules/GetEnrollment.modules.js";
import updateProgress from "./enrollmentModules/UpdateProgress.modules.js";

router.use(protect);

router.post("/", validation(enrollCourseSchema), enrollCourse);
router.get("/my", getMyEnrollments);
router.get("/:id", validation(enrollmentIdSchema), getEnrollment);
router.patch("/:id/progress", validation(updateProgressSchema), updateProgress);

export default router;
