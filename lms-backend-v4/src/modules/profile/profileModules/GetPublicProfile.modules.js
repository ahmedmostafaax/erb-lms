import User from "../../../../database/models/user.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const getPublicProfile = catchError(async (req, res, next) => {
  const user = await User.findById(req.params.id).select(
    "name avatarUrl role profile.bio profile.linkedinUrl profile.portfolioUrl profile.badges profile.skills"
  );

  if (!user) return next(new AppError("المستخدم غير موجود", 404));

  res.status(200).json({ status: "success", data: user });
});

export default getPublicProfile;