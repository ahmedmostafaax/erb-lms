import express from "express";
import { protect } from "../../middleware/auth.js";
import catchError from "../../middleware/catchError.js";
import AppError from "../../utils/AppError.js";

const router = express.Router();

router.post(
  "/manual",
  protect,
  catchError(async (req, res, next) => {
    const Order = (await import("../../../database/models/order.model.js")).default;
    const Course = (await import("../../../database/models/course.model.js")).default;
    const course = await Course.findById(req.body.courseId);
    if (!course) return next(new AppError("الكورس غير موجود", 404));
    if (course.price <= 0) return next(new AppError("الكورس مجاني — سجّل مباشرة", 400));
    const order = await Order.create({
      user: req.user._id,
      course: course._id,
      amount: course.price,
      total: course.price,
      status: "pending",
      paymentMethod: "manual_transfer",
      note: req.body.note || "",
    });
    res.status(201).json({ status: "success", data: order });
  })
);

router.patch(
  "/:id/confirm",
  protect,
  catchError(async (req, res, next) => {
    if (req.user.role !== "admin") return next(new AppError("غير مصرح", 403));
    const Order = (await import("../../../database/models/order.model.js")).default;
    const Enrollment = (await import("../../../database/models/enrollment.model.js")).default;
    const order = await Order.findById(req.params.id);
    if (!order) return next(new AppError("الطلب غير موجود", 404));
    if (order.status === "paid" || order.status === "confirmed") {
      return res.json({ status: "success", data: order });
    }
    order.status = "paid";
    await order.save();
    await Enrollment.findOneAndUpdate(
      { user: order.user, course: order.course },
      { user: order.user, course: order.course, status: "active", progressPercent: 0, completedLessonIds: [] },
      { upsert: true, new: true }
    );
    res.json({ status: "success", data: order });
  })
);

router.get(
  "/all",
  protect,
  catchError(async (req, res, next) => {
    if (req.user.role !== "admin") return next(new AppError("غير مصرح", 403));
    const Order = (await import("../../../database/models/order.model.js")).default;
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("course", "title price")
      .sort("-createdAt")
      .limit(100);
    res.json({ status: "success", data: orders });
  })
);


router.get(
  "/mine",
  protect,
  catchError(async (req, res) => {
    const Order = (await import("../../../database/models/order.model.js")).default;
    const orders = await Order.find({ user: req.user._id })
      .populate("course", "title price")
      .sort("-createdAt");
    res.json({ status: "success", data: orders });
  })
);

router.patch(
  "/:id/cancel",
  protect,
  catchError(async (req, res, next) => {
    const Order = (await import("../../../database/models/order.model.js")).default;
    const order = await Order.findById(req.params.id);
    if (!order) return next(new AppError("الطلب غير موجود", 404));
    if (order.user.toString() !== req.user._id.toString()) {
      return next(new AppError("غير مصرح", 403));
    }
    if (!["pending", "unpaid", "created"].includes(String(order.status))) {
      return next(new AppError("لا يمكن إلغاء هذا الطلب", 400));
    }
    order.status = "cancelled";
    await order.save();
    res.json({ status: "success", data: order });
  })
);

// لو عندك routes إنشاء طلب قديمة، أعد استيرادها تحت هنا من ملفات modules لو لزم
// مثال: import createOrder from "./orderModules/CreateOrder.modules.js";

export default router;
