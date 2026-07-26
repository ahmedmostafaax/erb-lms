import User from "../../database/models/user.model.js";
import catchError from "./catchError.js";
import AppError from "../utils/AppError.js";

const emailExist = catchError(async (req, res, next) => {
  const user = await User.findOne({ email: req.body.email });
  if (user) {
    return next(new AppError("البريد الإلكتروني مستخدم بالفعل", 400));
  }
  next();
});

export default emailExist;
