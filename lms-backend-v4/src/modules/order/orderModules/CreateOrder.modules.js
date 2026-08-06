import Order from "../../../../database/models/order.model.js";
import Course from "../../../../database/models/course.model.js";
import Coupon from "../../../../database/models/coupon.model.js";
import Enrollment from "../../../../database/models/enrollment.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const createOrder = catchError(async (req, res, next) => {
  const courseId = req.body.courseId;
  const couponCode = (req.body.couponCode || "").toString().trim().toUpperCase();

  const course = await Course.findById(courseId);
  if (!course || course.status !== "published") {
    return next(new AppError("الكورس غير متاح", 404));
  }

  const already = await Enrollment.findOne({ user: req.user._id, course: courseId });
  if (already) return next(new AppError("أنت مسجّل في الكورس ده بالفعل", 400));

  let amount = course.price;
  const originalAmount = course.price;
  let discount = 0;
  let appliedCode = null;

  if (couponCode) {
    const coupon = await Coupon.findOne({ code: couponCode, isActive: true });
    if (!coupon) return next(new AppError("كوبون غير صالح", 400));
    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      return next(new AppError("انتهت صلاحية الكوبون", 400));
    }
    if (coupon.course && coupon.course.toString() !== courseId.toString()) {
      return next(new AppError("الكوبون غير صالح لهذا الكورس", 400));
    }
    if (coupon.maxUses != null && coupon.usedCount >= coupon.maxUses) {
      return next(new AppError("تم استنفاد الكوبون", 400));
    }
    if (coupon.discountType === "percent") {
      discount = Math.round((originalAmount * coupon.value) / 100);
    } else {
      discount = coupon.value;
    }
    amount = Math.max(0, originalAmount - discount);
    appliedCode = coupon.code;
  }

  let order = await Order.findOne({
    user: req.user._id,
    course: courseId,
    status: "pending",
  });

  if (order) {
    order.amount = amount;
    order.originalAmount = originalAmount;
    order.discount = discount;
    order.couponCode = appliedCode;
    await order.save();
  } else {
    order = await Order.create({
      user: req.user._id,
      course: courseId,
      amount,
      originalAmount,
      discount,
      couponCode: appliedCode,
    });
  }

  res.status(201).json({ status: "success", data: order });
});

export default createOrder;
