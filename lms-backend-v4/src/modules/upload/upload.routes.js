import express from "express";
const router = express.Router();

import { protect } from "../../middleware/auth.js";
import { uploadImage, uploadVideo, uploadDocument } from "../../middleware/uploadMiddleware.js";
import catchError from "../../middleware/catchError.js";
import AppError from "../../utils/AppError.js";
import uploadToCloudinary from "../../utils/uploadToCloudinary.js";

router.use(protect);

router.post(
  "/image",
  uploadImage.single("file"),
  catchError(async (req, res, next) => {
    if (!req.file) return next(new AppError("لازم ترفع ملف", 400));
    const result = await uploadToCloudinary(req.file.buffer, "images", "image");
    res.status(200).json({ status: "success", data: { url: result.secure_url } });
  })
);

router.post(
  "/video",
  uploadVideo.single("file"),
  catchError(async (req, res, next) => {
    if (!req.file) return next(new AppError("لازم ترفع ملف", 400));
    const result = await uploadToCloudinary(req.file.buffer, "videos", "video");
    res.status(200).json({ status: "success", data: { url: result.secure_url } });
  })
);

router.post(
  "/document",
  uploadDocument.single("file"),
  catchError(async (req, res, next) => {
    if (!req.file) return next(new AppError("لازم ترفع ملف", 400));
    const result = await uploadToCloudinary(req.file.buffer, "documents", "raw");
    res.status(200).json({ status: "success", data: { url: result.secure_url } });
  })
);

export default router;