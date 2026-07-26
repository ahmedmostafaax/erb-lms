import User from "../../../../database/models/user.model.js";
import catchError from "../../../middleware/catchError.js";

const updateSettings = catchError(async (req, res, next) => {
  const allowedFields = ["notificationsEnabled", "privacyLevel", "language"];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) {
      updateData[`settings.${field}`] = req.body[field];
    }
  });

  const user = await User.findByIdAndUpdate(req.user._id, { $set: updateData }, { new: true });

  res.status(200).json({ status: "success", data: user.settings });
});

export default updateSettings;