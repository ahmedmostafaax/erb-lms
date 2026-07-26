import Order from "../../../../database/models/order.model.js";
import catchError from "../../../middleware/catchError.js";

const getMyOrders = catchError(async (req, res, next) => {
  const orders = await Order.find({ user: req.user._id })
    .populate("course", "title thumbnailUrl price")
    .sort("-createdAt");

  res.status(200).json({ status: "success", results: orders.length, data: orders });
});

export default getMyOrders;