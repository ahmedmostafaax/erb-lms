import Notification from "../../../../database/models/notification.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const deleteNotification = catchError(async (req, res, next) => {
  const notification = await Notification.findOneAndDelete({ _id: req.params.id, user: req.user._id });
  if (!notification) return next(new AppError("الإشعار غير موجود", 404));

  res.status(200).json({ status: "success", message: "تم حذف الإشعار بنجاح" });
});

export default deleteNotification;