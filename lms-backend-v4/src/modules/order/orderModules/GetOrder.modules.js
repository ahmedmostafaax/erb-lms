import Order from "../../../../database/models/order.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const getOrder = catchError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("course", "title thumbnailUrl price");
  if (!order) return next(new AppError("الطلب غير موجود", 404));

  const isOwner = order.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return next(new AppError("مالكش صلاحية تشوف الطلب ده", 403));
  }

  res.status(200).json({ status: "success", data: order });
});

export default getOrder;