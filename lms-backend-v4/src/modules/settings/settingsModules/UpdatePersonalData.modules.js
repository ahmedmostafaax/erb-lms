import User from "../../../../database/models/user.model.js";
import catchError from "../../../middleware/catchError.js";

const updatePersonalData = catchError(async (req, res, next) => {
  const allowedFields = ["name", "phone", "avatarUrl"];
  const updateData = {};

  allowedFields.forEach((field) => {
    if (req.body[field] !== undefined) updateData[field] = req.body[field];
  });

  const user = await User.findByIdAndUpdate(req.user._id, updateData, { new: true });

  res.status(200).json({ status: "success", data: user });
});

export default updatePersonalData;