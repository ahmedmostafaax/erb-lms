import { Post } from "../../../../database/models/community.model.js";
import Notification from "../../../../database/models/notification.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import checkEnrollment from "../../../utils/checkEnrollment.js";

const addComment = catchError(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError("المنشور غير موجود", 404));

  await checkEnrollment(post.course, req.user);

  post.comments.push({ user: req.user._id, content: req.body.content });
  await post.save();

  if (post.user.toString() !== req.user._id.toString()) {
    try {
      await Notification.create({
        user: post.user,
        type: "system",
        message: `تعليق جديد على منشورك من ${req.user.name}`,
        link: `/community/${post.course}`,
      });
    } catch {}
  }

  res.status(201).json({ status: "success", data: post.comments[post.comments.length - 1] });
});

export default addComment;
