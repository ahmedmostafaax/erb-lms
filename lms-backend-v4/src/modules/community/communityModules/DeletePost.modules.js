import { Post } from "../../../../database/models/community.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const deletePost = catchError(async (req, res, next) => {
  const post = await Post.findById(req.params.id);
  if (!post) return next(new AppError("المنشور غير موجود", 404));

  const isOwner = post.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return next(new AppError("مالكش صلاحية تحذف المنشور ده", 403));
  }

  await post.deleteOne();
  res.status(200).json({ status: "success", message: "تم حذف المنشور بنجاح" });
});

export default deletePost;