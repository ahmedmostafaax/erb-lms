import express from "express";
const router = express.Router();

import validation from "../../middleware/validation.js";
import { protect } from "../../middleware/auth.js";
import { createReviewSchema, updateReviewSchema, reviewIdSchema } from "./review.validation.js";

import createReview from "./reviewModules/CreateReview.modules.js";
import getCourseReviews from "./reviewModules/GetCourseReviews.modules.js";
import updateReview from "./reviewModules/UpdateReview.modules.js";
import deleteReview from "./reviewModules/DeleteReview.modules.js";

router.get("/course/:courseId", getCourseReviews); // متاح لأي حد، مش محتاج تسجيل دخول

router.use(protect); // الباقي محتاج تسجيل دخول
router.post("/", validation(createReviewSchema), createReview);
router.put("/:id", validation(updateReviewSchema), updateReview);
router.delete("/:id", validation(reviewIdSchema), deleteReview);

export default router;