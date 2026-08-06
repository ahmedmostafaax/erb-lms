import express from "express";
import Course from "../../../database/models/course.model.js";
import Enrollment from "../../../database/models/enrollment.model.js";
import { protect, allowedTo } from "../../middleware/auth.js";
import catchError from "../../middleware/catchError.js";

const router = express.Router();
router.use(protect, allowedTo("instructor", "admin"));

router.get(
  "/stats",
  catchError(async (req, res) => {
    const courses = await Course.find({ instructor: req.user._id }).select(
      "_id title price enrollmentCount ratingAvg ratingCount status"
    );
    const courseIds = courses.map((c) => c._id);
    const enrollments = await Enrollment.find({ course: { $in: courseIds } });

    const published = courses.filter((c) => c.status === "published").length;
    const studentsCount = enrollments.length;
    const completedCount = enrollments.filter((e) => e.status === "completed").length;
    const estimatedRevenue = courses.reduce(
      (sum, c) => sum + (c.price || 0) * (c.enrollmentCount || 0),
      0
    );

    res.json({
      status: "success",
      data: {
        coursesCount: courses.length,
        publishedCount: published,
        studentsCount,
        completedCount,
        estimatedRevenue,
        courses,
      },
    });
  })
);

router.get(
  "/stats/period",
  catchError(async (req, res) => {
    const days = Number(req.query.days) || 30;
    const since = new Date(Date.now() - days * 24 * 60 * 60 * 1000);
    const courses = await Course.find({ instructor: req.user._id }).select("_id title price");
    const courseIds = courses.map((c) => c._id);
    const enrollments = await Enrollment.find({
      course: { $in: courseIds },
      createdAt: { $gte: since },
    });
    res.json({
      status: "success",
      data: {
        days,
        newEnrollments: enrollments.length,
        coursesCount: courses.length,
      },
    });
  })
);


router.post(
  "/courses/:id/clone",
  protect,
  allowedTo("instructor", "admin"),
  catchError(async (req, res, next) => {
    const Course = (await import("../../../database/models/course.model.js")).default;
    const src = await Course.findById(req.params.id);
    if (!src) return next(new AppError("الكورس غير موجود", 404));
    if (src.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return next(new AppError("غير مصرح", 403));
    }
    const obj = src.toObject();
    delete obj._id;
    delete obj.createdAt;
    delete obj.updatedAt;
    delete obj.__v;
    obj.title = `${src.title} (نسخة)`;
    obj.status = "draft";
    obj.enrollmentCount = 0;
    obj.ratingAvg = 0;
    obj.ratingCount = 0;
    obj.instructor = req.user._id;
    if (obj.modules) {
      obj.modules = obj.modules.map((m) => {
        const nm = { ...m };
        delete nm._id;
        nm.lessons = (nm.lessons || []).map((l) => {
          const nl = { ...l };
          delete nl._id;
          return nl;
        });
        return nm;
      });
    }
    const copy = await Course.create(obj);
    res.status(201).json({ status: "success", data: copy });
  })
);


router.post(
  "/lesson-views",
  protect,
  catchError(async (req, res) => {
    const LessonView = (await import("../../../database/models/lessonView.model.js")).default;
    const { courseId, lessonId, seconds = 0 } = req.body;
    await LessonView.findOneAndUpdate(
      { course: courseId, lessonId, user: req.user._id },
      { $max: { seconds: Number(seconds) || 0 } },
      { upsert: true, new: true }
    );
    res.json({ status: "success" });
  })
);

router.get(
  "/courses/:id/lesson-stats",
  protect,
  allowedTo("instructor", "admin"),
  catchError(async (req, res, next) => {
    const Course = (await import("../../../database/models/course.model.js")).default;
    const LessonView = (await import("../../../database/models/lessonView.model.js")).default;
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError("الكورس غير موجود", 404));
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return next(new AppError("غير مصرح", 403));
    }
    const rows = await LessonView.aggregate([
      { $match: { course: course._id } },
      {
        $group: {
          _id: "$lessonId",
          viewers: { $sum: 1 },
          avgSeconds: { $avg: "$seconds" },
        },
      },
    ]);
    res.json({ status: "success", data: rows });
  })
);


router.patch(
  "/courses/:id/schedule-publish",
  protect,
  allowedTo("instructor", "admin"),
  catchError(async (req, res, next) => {
    const Course = (await import("../../../database/models/course.model.js")).default;
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError("الكورس غير موجود", 404));
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return next(new AppError("غير مصرح", 403));
    }
    const at = req.body.scheduledPublishAt ? new Date(req.body.scheduledPublishAt) : null;
    course.scheduledPublishAt = at;
    if (at && at > new Date()) course.status = "draft";
    await course.save();
    res.json({ status: "success", data: course });
  })
);


router.get(
  "/revenue",
  protect,
  allowedTo("instructor", "admin"),
  catchError(async (req, res) => {
    const Course = (await import("../../../database/models/course.model.js")).default;
    const courses = await Course.find({ instructor: req.user._id }).select(
      "title price enrollmentCount status"
    );
    const rows = courses.map((c) => ({
      _id: c._id,
      title: c.title,
      price: c.price,
      enrollmentCount: c.enrollmentCount || 0,
      revenue: (c.price || 0) * (c.enrollmentCount || 0),
      status: c.status,
    }));
    const total = rows.reduce((s, r) => s + r.revenue, 0);
    res.json({ status: "success", data: { total, rows } });
  })
);


// إرسال للمراجعة
router.post(
  "/courses/:id/submit",
  protect,
  allowedTo("instructor", "admin"),
  catchError(async (req, res, next) => {
    const Course = (await import("../../../database/models/course.model.js")).default;
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError("الكورس غير موجود", 404));
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return next(new AppError("غير مصرح", 403));
    }
    if (!course.title || !String(course.title).trim()) {
      return next(new AppError("أضف عنوان للكورس", 400));
    }
    const lessonCount = (course.modules || []).reduce((s, m) => s + (m.lessons?.length || 0), 0);
    if (lessonCount < 1) {
      return next(new AppError("أضف درس واحد على الأقل قبل الإرسال للمراجعة", 400));
    }
    course.status = "pending";
    course.rejectionReason = "";
    course.reviewLog = course.reviewLog || [];
    course.reviewLog.push({ action: "submit", by: req.user._id, at: new Date() });
    await course.save();
    res.json({ status: "success", data: course });
  })
);

// قائمة المسجّلين
router.get(
  "/courses/:id/students",
  protect,
  allowedTo("instructor", "admin"),
  catchError(async (req, res, next) => {
    const Course = (await import("../../../database/models/course.model.js")).default;
    const Enrollment = (await import("../../../database/models/enrollment.model.js")).default;
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError("الكورس غير موجود", 404));
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return next(new AppError("غير مصرح", 403));
    }
    const rows = await Enrollment.find({ course: course._id })
      .populate("user", "name email")
      .select("progressPercent status createdAt user");
    res.json({ status: "success", data: rows });
  })
);

// إعلان لكل طلاب الكورس
router.post(
  "/courses/:id/announce",
  protect,
  allowedTo("instructor", "admin"),
  catchError(async (req, res, next) => {
    const Course = (await import("../../../database/models/course.model.js")).default;
    const Enrollment = (await import("../../../database/models/enrollment.model.js")).default;
    const Notification = (await import("../../../database/models/notification.model.js")).default;
    const course = await Course.findById(req.params.id);
    if (!course) return next(new AppError("الكورس غير موجود", 404));
    if (course.instructor.toString() !== req.user._id.toString() && req.user.role !== "admin") {
      return next(new AppError("غير مصرح", 403));
    }
    const message = (req.body.message || "").trim();
    if (!message) return next(new AppError("اكتب نص الإعلان", 400));
    const enrollments = await Enrollment.find({ course: course._id }).select("user");
    const docs = enrollments.map((e) => ({
      user: e.user,
      type: "system",
      message: `إعلان — ${course.title}: ${message}`,
      link: `/learn/${course._id}`,
    }));
    if (docs.length) await Notification.insertMany(docs);
    res.json({ status: "success", sent: docs.length });
  })
);


export default router;
