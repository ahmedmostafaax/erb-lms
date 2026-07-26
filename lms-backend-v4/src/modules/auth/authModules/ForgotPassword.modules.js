import User from "../../../../database/models/user.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import generateOTP from "../../../utils/generateOTP.js";
import sendEmail from "../../../utils/sendEmail.js";

const forgotPassword = catchError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("مفيش حساب مرتبط بالإيميل ده", 404));

  const { otp, hashedOTP } = generateOTP();
  user.passwordResetCode = { code: hashedOTP, expiresAt: Date.now() + 10 * 60 * 1000 };
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "إعادة تعيين كلمة المرور",
    html: `<p>كود إعادة تعيين كلمة المرور بتاعك هو: <b>${otp}</b></p><p>صالح لمدة 10 دقايق.</p>`,
  });

  res.status(200).json({ status: "success", message: "تم إرسال كود إعادة التعيين إلى بريدك الإلكتروني" });
});

export default forgotPassword;