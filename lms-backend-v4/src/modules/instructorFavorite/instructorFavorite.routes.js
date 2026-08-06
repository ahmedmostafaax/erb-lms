import express from "express";
import InstructorFavorite from "../../../database/models/instructorFavorite.model.js";
import User from "../../../database/models/user.model.js";
import { protect } from "../../middleware/auth.js";
import catchError from "../../middleware/catchError.js";
import AppError from "../../utils/AppError.js";

const router = express.Router();
router.use(protect);

router.get(
  "/",
  catchError(async (req, res) => {
    const list = await InstructorFavorite.find({ user: req.user._id })
      .populate("instructor", "name avatarUrl profile")
      .sort("-createdAt");
    res.json({ status: "success", data: list });
  })
);

router.post(
  "/:instructorId",
  catchError(async (req, res, next) => {
    const ins = await User.findById(req.params.instructorId);
    if (!ins || !["instructor", "admin"].includes(ins.role)) {
      return next(new AppError("مدرّس غير موجود", 404));
    }
    const fav = await InstructorFavorite.findOneAndUpdate(
      { user: req.user._id, instructor: ins._id },
      {},
      { upsert: true, new: true }
    );
    res.status(201).json({ status: "success", data: fav });
  })
);

router.delete(
  "/:instructorId",
  catchError(async (req, res) => {
    await InstructorFavorite.findOneAndDelete({
      user: req.user._id,
      instructor: req.params.instructorId,
    });
    res.json({ status: "success", message: "تم الحذف" });
  })
);

export default router;
