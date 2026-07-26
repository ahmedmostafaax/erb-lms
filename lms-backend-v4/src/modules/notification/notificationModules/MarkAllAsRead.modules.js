import Notification from "../../../../database/models/notification.model.js";
import catchError from "../../../middleware/catchError.js";

const markAllAsRead = catchError(async (req, res, next) => {
  await Notification.updateMany({ user: req.user._id, isRead: false }, { isRead: true });
  res.status(200).json({ status: "success", message: "تم تحديد كل الإشعارات كمقروءة" });
});

export default markAllAsRead;