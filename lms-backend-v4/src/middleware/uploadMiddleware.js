import multer from "multer";
import AppError from "../utils/AppError.js";

const storage = multer.memoryStorage();

const fileFilter = (allowedTypes) => (req, file, cb) => {
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new AppError(`نوع الملف غير مسموح، الأنواع المسموحة: ${allowedTypes.join(", ")}`, 400), false);
  }
};

export const uploadImage = multer({
  storage,
  fileFilter: fileFilter(["image/jpeg", "image/png", "image/webp"]),
  limits: { fileSize: 5 * 1024 * 1024 },
});

export const uploadVideo = multer({
  storage,
  fileFilter: fileFilter(["video/mp4", "video/webm", "video/quicktime"]),
  limits: { fileSize: 500 * 1024 * 1024 },
});

// بتقبل صورة أو فيديو في نفس الحقل، مستخدمة في معرض الكورس
export const uploadMedia = multer({
  storage,
  fileFilter: fileFilter([
    "image/jpeg",
    "image/png",
    "image/webp",
    "video/mp4",
    "video/webm",
    "video/quicktime",
  ]),
  limits: { fileSize: 500 * 1024 * 1024 },
});

export const uploadDocument = multer({
  storage,
  fileFilter: fileFilter([
    "application/pdf",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/zip",
  ]),
  limits: { fileSize: 20 * 1024 * 1024 },
});
