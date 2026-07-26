import Enrollment from "../../../../database/models/enrollment.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const getEnrollment = catchError(async (req, res, next) => {
  const enrollment = await Enrollment.findById(req.params.id).populate("course");
  if (!enrollment) return next(new AppError("التسجيل غير موجود", 404));

  const isOwner = enrollment.user.toString() === req.user._id.toString();
  if (!isOwner && req.user.role !== "admin") {
    return next(new AppError("مالكش صلاحية تشوف التسجيل ده", 403));
  }

  res.status(200).json({ status: "success", data: enrollment });
});

export default getEnrollment;
