import User from "../../../../database/models/user.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import uploadToCloudinary from "../../../utils/uploadToCloudinary.js";

const updateCv = catchError(async (req, res, next) => {
  if (!req.file) return next(new AppError("لازم ترفع ملف", 400));

  const result = await uploadToCloudinary(req.file.buffer, "cvs", "raw");

  const user = await User.findByIdAndUpdate(
    req.user._id,
    { "profile.cvUrl": result.secure_url },
    { new: true }
  );

  res.status(200).json({ status: "success", data: { cvUrl: user.profile.cvUrl } });
});

export default updateCv;