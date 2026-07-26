import Enrollment from "../../../../database/models/enrollment.model.js";
import Course from "../../../../database/models/course.model.js";
import Certificate from "../../../../database/models/certificate.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const updateProgress = catchError(async (req, res, next) => {
  const enrollment = await Enrollment.findById(req.params.id);
  if (!enrollment) return next(new AppError("التسجيل غير موجود", 404));

  const isOwner = enrollment.user.toString() === req.user._id.toString();
  if (!isOwner) return next(new AppError("مالكش صلاحية تعدّل التقدم ده", 403));

  const { lessonId } = req.body;
  const alreadyCompleted = enrollment.completedLessonIds.some((id) => id.toString() === lessonId);
  if (!alreadyCompleted) {
    enrollment.completedLessonIds.push(lessonId);
  }
  enrollment.lastLessonId = lessonId;

  const course = await Course.findById(enrollment.course);
  const totalLessons = course.modules.reduce((sum, m) => sum + m.lessons.length, 0);
  enrollment.progressPercent =
    totalLessons > 0 ? Math.round((enrollment.completedLessonIds.length / totalLessons) * 100) : 0;

  if (enrollment.progressPercent >= 100) {
    enrollment.status = "completed";

    // إصدار شهادة تلقائيًا أول مرة بس الكورس يكتمل
    if (!enrollment.certificateIssued) {
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:3000";
      const certificate = await Certificate.create({
        user: enrollment.user,
        course: enrollment.course,
        certificateUrl: "pending", // هيتحدث تحت بعد ما ناخد الـ id الحقيقي
      });
      certificate.certificateUrl = `${frontendUrl}/certificates/${certificate._id}`;
      await certificate.save();

      enrollment.certificateIssued = true;
    }
  }

  await enrollment.save();

  res.status(200).json({ status: "success", data: enrollment });
});

export default updateProgress;
