import express from "express";
import LearningPath from "../../../database/models/learningPath.model.js";
import { protect, allowedTo } from "../../middleware/auth.js";
import catchError from "../../middleware/catchError.js";
import AppError from "../../utils/AppError.js";

const router = express.Router();

router.get(
  "/",
  catchError(async (req, res) => {
    const paths = await LearningPath.find({ isPublished: true })
      .populate({
        path: "courses",
        select: "title price level thumbnailUrl ratingAvg ratingCount status",
        match: { status: "published" },
      })
      .sort("-createdAt");
    res.json({ status: "success", results: paths.length, data: paths });
  })
);

router.get(
  "/:id",
  catchError(async (req, res, next) => {
    const path = await LearningPath.findById(req.params.id).populate({
      path: "courses",
      select: "title description price level thumbnailUrl ratingAvg ratingCount instructor status",
      populate: { path: "instructor", select: "name" },
    });
    if (!path) return next(new AppError("المسار غير موجود", 404));
    res.json({ status: "success", data: path });
  })
);

router.post(
  "/",
  protect,
  allowedTo("admin"),
  catchError(async (req, res) => {
    const path = await LearningPath.create(req.body);
    res.status(201).json({ status: "success", data: path });
  })
);

export default router;
