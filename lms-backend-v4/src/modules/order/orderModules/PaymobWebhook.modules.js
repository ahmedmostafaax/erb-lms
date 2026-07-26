import Order from "../../../../database/models/order.model.js";
import Enrollment from "../../../../database/models/enrollment.model.js";
import Course from "../../../../database/models/course.model.js";
import catchError from "../../../middleware/catchError.js";
import paymobService from "../../../utils/paymobService.js";

const paymobWebhook = catchError(async (req, res, next) => {
  const receivedHmac = req.query.hmac;
  const data = req.body.obj;

  const isValid = paymobService.verifyHmac({ ...data, receivedHmac });
  if (!isValid) {
    return res.status(401).json({ status: "fail", message: "توقيع غير صحيح" });
  }

  const order = await Order.findOne({ paymobOrderId: data.order.id });
  if (!order) return res.status(404).json({ status: "fail", message: "الطلب غير موجود" });

  if (data.success) {
    order.status = "paid";
    order.payment.status = "success";
    order.payment.transactionId = data.id;
    order.payment.paidAt = Date.now();
    await order.save();

    const alreadyEnrolled = await Enrollment.findOne({ user: order.user, course: order.course });
    if (!alreadyEnrolled) {
      await Enrollment.create({ user: order.user, course: order.course });
      await Course.findByIdAndUpdate(order.course, { $inc: { enrollmentCount: 1 } });
    }
  } else {
    order.status = "failed";
    order.payment.status = "failed";
    await order.save();
  }

  res.status(200).json({ status: "success" });
});

export default paymobWebhook;