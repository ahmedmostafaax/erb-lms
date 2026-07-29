import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import uploadToCloudinary from "../../../utils/uploadToCloudinary.js";
import checkOwnership from "../../../utils/checkOwnership.js";

const addGalleryItem = catchError(async (req, res, next) => {
  const course = await Course.findById(req.params.id);
  if (!course) return next(new AppError("الكورس غير موجود", 404));

  if (!checkOwnership(course.instructor, req.user)) {
    return next(new AppError("مالكش صلاحية تعدّل معرض الكورس ده", 403));
  }

  if (!req.file) return next(new AppError("لازم ترفع صورة أو فيديو", 400));

  const isVideo = req.file.mimetype.startsWith("video");
  const result = await uploadToCloudinary(
    req.file.buffer,
    "gallery",
    isVideo ? "video" : "image"
  );

  course.gallery.push({ type: isVideo ? "video" : "image", url: result.secure_url });
  await course.save();

  res.status(201).json({ status: "success", data: course.gallery[course.gallery.length - 1] });
});

export default addGalleryItem;
