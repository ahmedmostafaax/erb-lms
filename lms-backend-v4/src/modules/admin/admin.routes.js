import express from "express";
import Course from "../../../database/models/course.model.js";
import User from "../../../database/models/user.model.js";
import Enrollment from "../../../database/models/enrollment.model.js";
import LearningPath from "../../../database/models/learningPath.model.js";
import Notification from "../../../database/models/notification.model.js";
import { protect, allowedTo } from "../../middleware/auth.js";
import catchError from "../../middleware/catchError.js";
import AppError from "../../utils/AppError.js";
import clearCache from "../../utils/clearCache.js";
import sendEmail from "../../utils/sendEmail.js";

const router = express.Router();
router.use(protect, allowedTo("admin"));

router.get(
  "/stats",
  catchError(async (req, res) => {
    const [users, courses, enrollments, instructors, pending] = await Promise.all([
      User.countDocuments(),
      Course.countDocuments(),
      Enrollment.countDocuments(),
      User.countDocuments({ role: "instructor" }),
      Course.countDocuments({ status: "pending" }),
    ]);

    const topCourses = await Course.find({ status: "published", rejectionReason: "", rejectionReason: "" })
      .sort("-enrollmentCount")
      .limit(5)
      .select("title enrollmentCount ratingAvg price");

    const estimatedRevenueAgg = await Course.aggregate([
      { $project: { revenue: { $multiply: ["$price", "$enrollmentCount"] } } },
      { $group: { _id: null, total: { $sum: "$revenue" } } },
    ]);

    res.json({
      status: "success",
      data: {
        users,
        courses,
        enrollments,
        instructors,
        pending,
        estimatedRevenue: estimatedRevenueAgg[0]?.total || 0,
        topCourses,
      },
    });
  })
);

router.get(
  "/users",
  catchError(async (req, res) => {
    const users = await User.find()
      .select("name email role createdAt isEmailVerified")
      .sort("-createdAt")
      .limit(200);
    res.json({ status: "success", results: users.length, data: users });
  })
);

router.patch(
  "/users/:id/role",
  catchError(async (req, res, next) => {
    const { role } = req.body;
    if (!["student", "instructor", "admin"].includes(role)) {
      return next(new AppError("دور غير صالح", 400));
    }
    const user = await User.findByIdAndUpdate(req.params.id, { role }, { new: true }).select(
      "name email role"
    );
    if (!user) return next(new AppError("المستخدم غير موجود", 404));
    res.json({ status: "success", data: user });
  })
);

router.delete(
  "/users/:id",
  catchError(async (req, res, next) => {
    if (req.params.id === req.user._id.toString()) {
      return next(new AppError("مش هتمسح نفسك", 400));
    }
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return next(new AppError("المستخدم غير موجود", 404));
    res.json({ status: "success", message: "تم الحذف" });
  })
);

router.get(
  "/courses",
  catchError(async (req, res) => {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const courses = await Course.find(filter)
      .populate("instructor", "name email")
      .populate("category", "name")
      .sort("-createdAt")
      .limit(200);
    res.json({ status: "success", results: courses.length, data: courses });
  })
);

router.get(
  "/courses/pending",
  catchError(async (req, res) => {
    const courses = await Course.find({ status: "pending" })
      .populate("instructor", "name email")
      .populate("category", "name")
      .sort("-createdAt");
    res.json({ status: "success", results: courses.length, data: courses });
  })
);

router.patch(
  "/courses/:id/approve",
  catchError(async (req, res, next) => {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { status: "published", rejectionReason: "", rejectionReason: "" },
      { new: true }
    ).populate("instructor", "name email");
    if (!course) return next(new AppError("الكورس غير موجود", 404));

    await Notification.create({
      user: course.instructor._id || course.instructor,
      type: "system",
      message: `تم قبول كورسك: ${course.title}`,
      link: `/instructor/courses/${course._id}/manage`,
    });

    try {
      const email = course.instructor?.email;
      if (email) {
        await sendEmail({
          to: email,
          subject: "تم قبول الكورس",
          html: `<p>تم قبول كورسك "${course.title}" وهو الآن منشور على المنصة.`,
        });
      }
    } catch {}

    try {
      await clearCache("courses");
    } catch {}
    res.json({ status: "success", data: course });
  })
);

router.patch(
  "/courses/:id/reject",
  catchError(async (req, res, next) => {
    const course = await Course.findByIdAndUpdate(
      req.params.id,
      { status: "rejected", rejectionReason: req.body?.reason || req.body?.rejectionReason || "", rejectionReason: req.body.reason || req.body.rejectionReason || "" },
      { new: true }
    ).populate("instructor", "name email");
    if (!course) return next(new AppError("الكورس غير موجود", 404));

    await Notification.create({
      user: course.instructor._id || course.instructor,
      type: "system",
      message: `تم رفض كورسك: ${course.title}`,
      link: `/instructor/courses/${course._id}/manage`,
    });

    try {
      const email = course.instructor?.email;
      if (email) {
        await sendEmail({
          to: email,
          subject: "تم رفض الكورس",
          html: `<p>تم رفض كورسك "${course.title}". راجع المحتوى وأعد الإرسال.`,
        });
      }
    } catch {}

    res.json({ status: "success", data: course });
  })
);

// مسارات التعلم
router.get(
  "/paths",
  catchError(async (req, res) => {
    const paths = await LearningPath.find().populate("courses", "title").sort("-createdAt");
    res.json({ status: "success", data: paths });
  })
);

router.post(
  "/paths",
  catchError(async (req, res) => {
    const path = await LearningPath.create(req.body);
    res.status(201).json({ status: "success", data: path });
  })
);

router.patch(
  "/paths/:id",
  catchError(async (req, res, next) => {
    const path = await LearningPath.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!path) return next(new AppError("المسار غير موجود", 404));
    res.json({ status: "success", data: path });
  })
);

router.delete(
  "/paths/:id",
  catchError(async (req, res, next) => {
    const path = await LearningPath.findByIdAndDelete(req.params.id);
    if (!path) return next(new AppError("المسار غير موجود", 404));
    res.json({ status: "success", message: "تم الحذف" });
  })
);


router.get(
  "/reports/funnel",
  catchError(async (req, res) => {
    const Course = (await import("../../../database/models/course.model.js")).default;
    const Enrollment = (await import("../../../database/models/enrollment.model.js")).default;
    const User = (await import("../../../database/models/user.model.js")).default;
    const users = await User.countDocuments();
    const courses = await Course.countDocuments({ status: "published", rejectionReason: "", rejectionReason: "" });
    const enrollments = await Enrollment.countDocuments();
    const completed = await Enrollment.countDocuments({ status: "completed" });
    res.json({
      status: "success",
      data: {
        users,
        publishedCourses: courses,
        enrollments,
        completed,
        enrollRate: users ? Math.round((enrollments / users) * 100) : 0,
        completeRate: enrollments ? Math.round((completed / enrollments) * 100) : 0,
      },
    });
  })
);


router.patch(
  "/users/:id/block",
  catchError(async (req, res, next) => {
    const User = (await import("../../../database/models/user.model.js")).default;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: true },
      { new: true }
    ).select("-password");
    if (!user) return next(new AppError("المستخدم غير موجود", 404));
    res.json({ status: "success", data: user });
  })
);

router.patch(
  "/users/:id/unblock",
  catchError(async (req, res, next) => {
    const User = (await import("../../../database/models/user.model.js")).default;
    const user = await User.findByIdAndUpdate(
      req.params.id,
      { isBlocked: false },
      { new: true }
    ).select("-password");
    if (!user) return next(new AppError("المستخدم غير موجود", 404));
    res.json({ status: "success", data: user });
  })
);


router.get(
  "/settings",
  catchError(async (req, res) => {
    const Settings = (await import("../../../database/models/platformSettings.model.js")).default;
    let s = await Settings.findOne();
    if (!s) s = await Settings.create({});
    res.json({ status: "success", data: s });
  })
);

router.patch(
  "/settings",
  catchError(async (req, res) => {
    const Settings = (await import("../../../database/models/platformSettings.model.js")).default;
    let s = await Settings.findOne();
    if (!s) s = await Settings.create({});
    if (req.body.platformName != null) s.platformName = req.body.platformName;
    if (req.body.supportEmail != null) s.supportEmail = req.body.supportEmail;
    await s.save();
    res.json({ status: "success", data: s });
  })
);

router.get(
  "/review-log",
  catchError(async (req, res) => {
    const Course = (await import("../../../database/models/course.model.js")).default;
    const courses = await Course.find({ "reviewLog.0": { $exists: true } })
      .select("title status reviewLog rejectionReason")
      .populate("reviewLog.by", "name email")
      .sort("-updatedAt")
      .limit(50);
    res.json({ status: "success", data: courses });
  })
);


export default router;
