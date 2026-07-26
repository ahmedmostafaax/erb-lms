import jwt from "jsonwebtoken";
import User from "../../database/models/user.model.js";
import catchError from "./catchError.js";
import AppError from "../utils/AppError.js";

const protect = catchError(async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new AppError("لازم تسجل الدخول الأول", 401));
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  const user = await User.findById(decoded.id);
  if (!user) {
    return next(new AppError("الحساب بتاع الـ token ده مش موجود", 401));
  }

  req.user = user;
  next();
});

const allowedTo = (...roles) => (req, res, next) => {
  if (!roles.includes(req.user.role)) {
    return next(new AppError("مالكش صلاحية تعمل العملية دي", 403));
  }
  next();
};

export { protect, allowedTo };
