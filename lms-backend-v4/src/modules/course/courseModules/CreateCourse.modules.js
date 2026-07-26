import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import uploadToCloudinary from "../../../utils/uploadToCloudinary.js";
import clearCache from "../../../utils/clearCache.js";

const createCourse = catchError(async (req, res, next) => {
  let thumbnailUrl;

  if (req.file) {
    const result = await uploadToCloudinary(req.file.buffer, "thumbnails", "image");
    thumbnailUrl = result.secure_url;
  }

  const course = await Course.create({
    ...req.body,
    thumbnailUrl,
    instructor: req.user._id,
  });

  await clearCache("courses");

  res.status(201).json({ status: "success", data: course });
});

export default createCourse;