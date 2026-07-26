import express from "express";
const router = express.Router();

import validation from "../../middleware/validation.js";
import { protect } from "../../middleware/auth.js";
import {
  createPostSchema,
  postIdSchema,
  addCommentSchema,
  createQuestionSchema,
  questionIdSchema,
  addAnswerSchema,
} from "./community.validation.js";

import createPost from "./communityModules/CreatePost.modules.js";
import getCoursePosts from "./communityModules/GetCoursePosts.modules.js";
import addComment from "./communityModules/AddComment.modules.js";
import deletePost from "./communityModules/DeletePost.modules.js";

import createQuestion from "./communityModules/CreateQuestion.modules.js";
import getCourseQuestions from "./communityModules/GetCourseQuestions.modules.js";
import addAnswer from "./communityModules/AddAnswer.modules.js";
import deleteQuestion from "./communityModules/DeleteQuestion.modules.js";

router.get("/posts/course/:courseId", getCoursePosts); // عرض متاح لأي حد
router.get("/questions/course/:courseId", getCourseQuestions); // عرض متاح لأي حد

router.use(protect); // الكتابة محتاجة تسجيل دخول

router.post("/posts", validation(createPostSchema), createPost);
router.post("/posts/:id/comments", validation(addCommentSchema), addComment);
router.delete("/posts/:id", validation(postIdSchema), deletePost);

router.post("/questions", validation(createQuestionSchema), createQuestion);
router.post("/questions/:id/answers", validation(addAnswerSchema), addAnswer);
router.delete("/questions/:id", validation(questionIdSchema), deleteQuestion);

export default router;