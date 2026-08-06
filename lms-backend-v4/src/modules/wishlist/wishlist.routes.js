import express from "express";
import Wishlist from "../../../database/models/wishlist.model.js";
import { protect } from "../../middleware/auth.js";
import catchError from "../../middleware/catchError.js";
import AppError from "../../utils/AppError.js";

const router = express.Router();
router.use(protect);

router.get(
  "/",
  catchError(async (req, res) => {
    const items = await Wishlist.find({ user: req.user._id })
      .populate({
        path: "course",
        populate: [
          { path: "instructor", select: "name avatarUrl" },
          { path: "category", select: "name slug" },
        ],
      })
      .sort("-createdAt");
    res.json({ status: "success", results: items.length, data: items });
  })
);

router.post(
  "/:courseId",
  catchError(async (req, res, next) => {
    try {
      const item = await Wishlist.create({
        user: req.user._id,
        course: req.params.courseId,
      });
      res.status(201).json({ status: "success", data: item });
    } catch (err) {
      if (err.code === 11000) return next(new AppError("الكورس موجود في المفضلة", 400));
      throw err;
    }
  })
);

router.delete(
  "/:courseId",
  catchError(async (req, res) => {
    await Wishlist.findOneAndDelete({
      user: req.user._id,
      course: req.params.courseId,
    });
    res.json({ status: "success", message: "تم الحذف من المفضلة" });
  })
);

export default router;
