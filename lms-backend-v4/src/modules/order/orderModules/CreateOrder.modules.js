import Order from "../../../../database/models/order.model.js";
import Course from "../../../../database/models/course.model.js";
import Enrollment from "../../../../database/models/enrollment.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const createOrder = catchError(async (req, res, next) => {
  const course = await Course.findById(req.body.courseId);
  if (!course || course.status !== "published") {
    return next(new AppError("الكورس غير موجود أو غير متاح", 404));
  }

  const alreadyEnrolled = await Enrollment.findOne({ user: req.user._id, course: course._id });
  if (alreadyEnrolled) {
    return next(new AppError("إنت مسجل في الكورس ده بالفعل", 400));
  }

  const existingPendingOrder = await Order.findOne({
    user: req.user._id,
    course: course._id,
    status: "pending",
  });
  if (existingPendingOrder) {
    return res.status(200).json({ status: "success", data: existingPendingOrder });
  }

  const order = await Order.create({
    user: req.user._id,
    course: course._id,
    amount: course.price,
  });

  res.status(201).json({ status: "success", data: order });
});

export default createOrder;