import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import checkOwnership from "../../../utils/checkOwnership.js";

const deleteGalleryItem = catchError(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError("الكورس غير موجود", 404));

  if (!checkOwnership(course.instructor, req.user)) {
    return next(new AppError("مالكش صلاحية تعدّل معرض الكورس ده", 403));
  }

  course.gallery.pull(req.params.itemId);
  await course.save();

  res.status(200).json({ status: "success", message: "تم حذف العنصر من المعرض" });
});

export default deleteGalleryItem;
