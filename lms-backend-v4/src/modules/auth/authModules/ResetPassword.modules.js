import crypto from "crypto";
import User from "../../../../database/models/user.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const resetPassword = catchError(async (req, res, next) => {
  const { email, otp, newPassword } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new AppError("مفيش حساب مرتبط بالإيميل ده", 404));

  if (!user.passwordResetCode || !user.passwordResetCode.expiresAt || user.passwordResetCode.expiresAt < Date.now()) {
    return next(new AppError("الكود منتهي الصلاحية، اطلب كود جديد", 400));
  }

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
  if (hashedOTP !== user.passwordResetCode.code) {
    return next(new AppError("الكود غير صحيح", 400));
  }

  user.password = newPassword; // هيتشفر تلقائي بفضل الـ pre-save hook
  user.passwordResetCode = undefined;
  await user.save();

  res.status(200).json({ status: "success", message: "تم إعادة تعيين كلمة المرور بنجاح، سجّل دخول بالباسورد الجديد" });
});

export default resetPassword;