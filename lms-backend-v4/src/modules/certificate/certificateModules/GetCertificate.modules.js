import Certificate from "../../../../database/models/certificate.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

// endpoint عام (من غير تسجيل دخول) عشان أي حد يقدر يتحقق من صحة الشهادة بالرابط
const getCertificate = catchError(async (req, res, next) => {
  const certificate = await Certificate.findById(req.params.id)
    .populate("user", "name")
    .populate("course", "title instructor")
    .populate({ path: "course", populate: { path: "instructor", select: "name" } });

  if (!certificate) return next(new AppError("الشهادة غير موجودة", 404));

  res.status(200).json({ status: "success", data: certificate });
});

export default getCertificate;
