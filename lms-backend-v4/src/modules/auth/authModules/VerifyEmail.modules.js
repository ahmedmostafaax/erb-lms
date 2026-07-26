import crypto from "crypto";
import jwt from "jsonwebtoken";
import User from "../../../../database/models/user.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const verifyEmail = catchError(async (req, res, next) => {
  const { email, otp } = req.body;

  const user = await User.findOne({ email });
  if (!user) return next(new AppError("الحساب غير موجود", 404));
  if (user.isEmailVerified) return next(new AppError("الحساب مؤكد بالفعل", 400));

  if (!user.otp || !user.otp.expiresAt || user.otp.expiresAt < Date.now()) {
    return next(new AppError("الكود منتهي الصلاحية، اطلب كود جديد", 400));
  }

  const hashedOTP = crypto.createHash("sha256").update(otp).digest("hex");
  if (hashedOTP !== user.otp.code) {
    return next(new AppError("كود التأكيد غير صحيح", 400));
  }

  user.isEmailVerified = true;
  user.otp = undefined;
  await user.save();

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({ status: "success", message: "تم تأكيد الحساب بنجاح", token });
});

export default verifyEmail;
