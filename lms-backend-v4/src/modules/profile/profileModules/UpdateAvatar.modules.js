import User from "../../../../database/models/user.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import uploadToCloudinary from "../../../utils/uploadToCloudinary.js";

const updateAvatar = catchError(async (req, res, next) => {
  if (!req.file) return next(new AppError("لازم ترفع صورة", 400));

  const result = await uploadToCloudinary(req.file.buffer, "avatars", "image");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { avatarUrl: result.secure_url },
    { new: true }
  );

  res.status(200).json({ status: "success", data: { avatarUrl: user.avatarUrl } });
});

export default updateAvatar;