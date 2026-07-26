import express from "express";
const router = express.Router();

import validation from "../../middleware/validation.js";
import { protect, allowedTo } from "../../middleware/auth.js";
import {
  createQuizSchema,
  quizIdSchema,
  submitQuizSchema,
  gradeSubmissionSchema,
} from "./assessment.validation.js";

import createQuiz from "./assessmentModules/CreateQuiz.modules.js";
import getQuiz from "./assessmentModules/GetQuiz.modules.js";
import updateQuiz from "./assessmentModules/UpdateQuiz.modules.js";
import deleteQuiz from "./assessmentModules/DeleteQuiz.modules.js";
import submitQuiz from "./assessmentModules/SubmitQuiz.modules.js";
import getMySubmission from "./assessmentModules/GetMySubmission.modules.js";
import getQuizSubmissions from "./assessmentModules/GetQuizSubmissions.modules.js";
import gradeSubmission from "./assessmentModules/GradeSubmission.modules.js";

router.use(protect); // كل حاجة هنا محتاجة تسجيل دخول

router.post("/", allowedTo("instructor", "admin"), validation(createQuizSchema), createQuiz);
router.get("/:id", validation(quizIdSchema), getQuiz);
router.put("/:id", allowedTo("instructor", "admin"), validation(createQuizSchema), updateQuiz);
router.delete("/:id", allowedTo("instructor", "admin"), validation(quizIdSchema), deleteQuiz);

router.post("/:id/submit", validation(submitQuizSchema), submitQuiz);
router.get("/:id/my-submission", validation(quizIdSchema), getMySubmission);
router.get(
  "/:id/submissions",
  allowedTo("instructor", "admin"),
  validation(quizIdSchema),
  getQuizSubmissions
);

router.patch(
  "/submissions/:id/grade",
  allowedTo("instructor", "admin"),
  validation(gradeSubmissionSchema),
  gradeSubmission
);

export default router;