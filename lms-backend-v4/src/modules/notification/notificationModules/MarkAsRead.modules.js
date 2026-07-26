import Notification from "../../../../database/models/notification.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const markAsRead = catchError(async (req, res, next) => {
  const notification = await Notification.findOne({ _id: req.params.id, user: req.user._id });
  if (!notification) return next(new AppError("الإشعار غير موجود", 404));

  notification.isRead = true;
  await notification.save();

  res.status(200).json({ status: "success", data: notification });
});

export default markAsRead;