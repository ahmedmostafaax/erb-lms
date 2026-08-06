import express from "express";
import LiveSession from "../../../database/models/liveSession.model.js";
import Course from "../../../database/models/course.model.js";
import { protect, allowedTo } from "../../middleware/auth.js";
import catchError from "../../middleware/catchError.js";
import AppError from "../../utils/AppError.js";

const router = express.Router();

// عامة: الجلسات القادمة
router.get(
  "/",
  catchError(async (req, res) => {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    else filter.status = { $in: ["scheduled", "live", "ended"] };
    if (req.query.courseId) filter.course = req.query.courseId;
    const sessions = await LiveSession.find(filter)
      .populate("instructor", "name avatarUrl")
      .populate("course", "title")
      .sort("startsAt")
      .limit(50);
    res.json({ status: "success", results: sessions.length, data: sessions });
  })
);

router.get(
  "/:id",
  catchError(async (req, res, next) => {
    const session = await LiveSession.findById(req.params.id)
      .populate("instructor", "name avatarUrl")
      .populate("course", "title");
    if (!session) return next(new AppError("الجلسة غير موجودة", 404));
    res.json({ status: "success", data: session });
  })
);

router.post(
  "/",
  protect,
  allowedTo("instructor", "admin"),
  catchError(async (req, res, next) => {
    const { title, description, courseId, meetingUrl, startsAt, endsAt } = req.body;
    if (!title || !meetingUrl || !startsAt) {
      return next(new AppError("العنوان ولينك الاجتماع والموعد مطلوبين", 400));
    }
    if (courseId) {
      const course = await Course.findById(courseId);
      if (!course) return next(new AppError("الكورس غير موجود", 404));
      if (
        course.instructor.toString() !== req.user._id.toString() &&
        req.user.role !== "admin"
      ) {
        return next(new AppError("مش كورسك", 403));
      }
    }
    const session = await LiveSession.create({
      title,
      description: description || "",
      course: courseId || undefined,
      instructor: req.user._id,
      meetingUrl,
      startsAt: new Date(startsAt),
      endsAt: endsAt ? new Date(endsAt) : undefined,
      status: "scheduled",
    });
    res.status(201).json({ status: "success", data: session });
  })
);

router.patch(
  "/:id/status",
  protect,
  allowedTo("instructor", "admin"),
  catchError(async (req, res, next) => {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return next(new AppError("الجلسة غير موجودة", 404));
    if (
      session.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(new AppError("مش جلستك", 403));
    }
    const { status } = req.body;
    if (!["scheduled", "live", "ended", "cancelled"].includes(status)) {
      return next(new AppError("حالة غير صالحة", 400));
    }
    session.status = status;
    await session.save();
    res.json({ status: "success", data: session });
  })
);

router.delete(
  "/:id",
  protect,
  allowedTo("instructor", "admin"),
  catchError(async (req, res, next) => {
    const session = await LiveSession.findById(req.params.id);
    if (!session) return next(new AppError("الجلسة غير موجودة", 404));
    if (
      session.instructor.toString() !== req.user._id.toString() &&
      req.user.role !== "admin"
    ) {
      return next(new AppError("مش جلستك", 403));
    }
    await session.deleteOne();
    res.json({ status: "success", message: "تم الحذف" });
  })
);

export default router;
