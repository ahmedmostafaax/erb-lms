import User from "../../../../database/models/user.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import generateOTP from "../../../utils/generateOTP.js";
import sendEmail from "../../../utils/sendEmail.js";

const resendOTP = catchError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (!user) return next(new AppError("الحساب غير موجود", 404));
  if (user.isEmailVerified) return next(new AppError("الحساب مؤكد بالفعل", 400));

  const { otp, hashedOTP } = generateOTP();
  user.otp = { code: hashedOTP, expiresAt: Date.now() + 10 * 60 * 1000 };
  await user.save();

  await sendEmail({
    to: user.email,
    subject: "كود تأكيد جديد",
    html: `<p>كود التأكيد بتاعك هو: <b>${otp}</b></p><p>صالح لمدة 10 دقايق.</p>`,
  });

  res.status(200).json({ status: "success", message: "تم إرسال كود جديد إلى بريدك الإلكتروني" });
});

export default resendOTP;
