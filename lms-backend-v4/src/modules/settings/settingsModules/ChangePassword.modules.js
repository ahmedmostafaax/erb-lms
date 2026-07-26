import User from "../../../../database/models/user.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const changePassword = catchError(async (req, res, next) => {
  const user = await User.findById(req.user._id).select("+password");

  const isCorrect = await user.comparePassword(req.body.currentPassword);
  if (!isCorrect) {
    return next(new AppError("كلمة المرور الحالية غير صحيحة", 400));
  }

  user.password = req.body.newPassword; // هيتشفر تلقائي بفضل الـ pre-save hook في الموديل
  await user.save();

  res.status(200).json({ status: "success", message: "تم تغيير كلمة المرور بنجاح" });
});

export default changePassword;