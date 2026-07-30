import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import uploadToCloudinary from "../../../utils/uploadToCloudinary.js";
import clearCache from "../../../utils/clearCache.js";

const createCourse = catchError(async (req, res, next) => {
  let thumbnailUrl;
  let thumbnailType = "image";

  if (req.file) {
    try {
      const mime = req.file.mimetype;
      const isVideo = mime.startsWith("video/");
      const isImage = mime.startsWith("image/");
      const resourceType = isVideo ? "video" : isImage ? "image" : "raw";

      const result = await uploadToCloudinary(req.file.buffer, "thumbnails", resourceType);
      thumbnailUrl = result.secure_url;
      thumbnailType = isVideo ? "video" : isImage ? "image" : "file";
    } catch (err) {
      console.error("Cloudinary error:", err);
      return next(new AppError("فشل رفع الملف", 500));
    }
  }

  const course = await Course.create({
    title: req.body.title,
    description: req.body.description,
    category: req.body.category,
    price: Number(req.body.price),
    level: req.body.level,
    language: req.body.language,
    thumbnailUrl,
    thumbnailType,
    instructor: req.user._id,
  });

  try {
    await clearCache("courses");
  } catch (err) {
    console.error("clearCache failed:", err.message);
  }

  res.status(201).json({ status: "success", data: course });
});

export default createCourse;