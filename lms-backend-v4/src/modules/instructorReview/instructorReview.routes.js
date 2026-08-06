import express from "express";
import InstructorReview from "../../../database/models/instructorReview.model.js";
import User from "../../../database/models/user.model.js";
import { protect } from "../../middleware/auth.js";
import catchError from "../../middleware/catchError.js";
import AppError from "../../utils/AppError.js";

const router = express.Router();

router.get(
  "/:instructorId",
  catchError(async (req, res) => {
    const reviews = await InstructorReview.find({ instructor: req.params.instructorId })
      .populate("user", "name avatarUrl")
      .sort("-createdAt");
    const avg =
      reviews.length > 0
        ? reviews.reduce((s, r) => s + r.rating, 0) / reviews.length
        : 0;
    res.json({
      status: "success",
      results: reviews.length,
      avgRating: Math.round(avg * 10) / 10,
      data: reviews,
    });
  })
);

router.post(
  "/:instructorId",
  protect,
  catchError(async (req, res, next) => {
    const instructor = await User.findById(req.params.instructorId);
    if (!instructor || !["instructor", "admin"].includes(instructor.role)) {
      return next(new AppError("المدرّس غير موجود", 404));
    }
    if (instructor._id.toString() === req.user._id.toString()) {
      return next(new AppError("مش هتقيّم نفسك", 400));
    }
    const { rating, comment } = req.body;
    if (!rating || rating < 1 || rating > 5) {
      return next(new AppError("التقييم من 1 لـ 5", 400));
    }
    const review = await InstructorReview.findOneAndUpdate(
      { instructor: instructor._id, user: req.user._id },
      { rating, comment: comment || "" },
      { upsert: true, new: true }
    );
    res.status(201).json({ status: "success", data: review });
  })
);

export default router;
