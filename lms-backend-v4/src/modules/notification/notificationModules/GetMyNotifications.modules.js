import Notification from "../../../../database/models/notification.model.js";
import catchError from "../../../middleware/catchError.js";
import ApiFeature from "../../../utils/ApiFeature.js";

const getMyNotifications = catchError(async (req, res, next) => {
  const baseQuery = Notification.find({ user: req.user._id });
  const apiFeature = new ApiFeature(baseQuery, req.query).sort().paginate();
  const notifications = await apiFeature.mongooseQuery;

  const unreadCount = await Notification.countDocuments({ user: req.user._id, isRead: false });

  res.status(200).json({
    status: "success",
    results: notifications.length,
    unreadCount,
    page: apiFeature.paginationResult.currentPage,
    data: notifications,
  });
});

export default getMyNotifications;