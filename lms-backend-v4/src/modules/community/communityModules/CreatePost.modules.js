import { Post } from "../../../../database/models/community.model.js";
import catchError from "../../../middleware/catchError.js";
import checkEnrollment from "../../../utils/checkEnrollment.js";

const createPost = catchError(async (req, res, next) => {
  await checkEnrollment(req.body.courseId, req.user);

  const post = await Post.create({
    course: req.body.courseId,
    user: req.user._id,
    content: req.body.content,
  });

  res.status(201).json({ status: "success", data: post });
});

export default createPost;