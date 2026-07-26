import jwt from "jsonwebtoken";
import User from "../../../../database/models/user.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const signIn = catchError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email }).select("+password");

  if (!user || !(await user.comparePassword(req.body.password))) {
    return next(new AppError("البريد الإلكتروني أو كلمة المرور غير صحيحة", 401));
  }

  if (!user.isEmailVerified) {
    return next(new AppError("لازم تأكد بريدك الإلكتروني الأول قبل تسجيل الدخول", 403));
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  user.password = undefined;
  res.status(200).json({ status: "success", token, data: user });
});

export default signIn;
