import Enrollment from "../../../../database/models/enrollment.model.js";
import Certificate from "../../../../database/models/certificate.model.js";
import catchError from "../../../middleware/catchError.js";

const getDashboard = catchError(async (req, res, next) => {
  const enrollments = await Enrollment.find({ user: req.user._id }).populate(
    "course",
    "title thumbnailUrl"
  );

  const certificates = await Certificate.find({ user: req.user._id }).populate("course", "title");

  const completedCount = enrollments.filter((e) => e.status === "completed").length;

  res.status(200).json({
    status: "success",
    data: {
      profile: req.user.profile,
      stats: {
        totalCourses: enrollments.length,
        completedCourses: completedCount,
        inProgressCourses: enrollments.length - completedCount,
        totalLearningHours: req.user.profile.totalLearningHours,
        certificatesCount: certificates.length,
        badgesCount: req.user.profile.badges.length,
      },
      enrollments,
      certificates,
    },
  });
});

export default getDashboard;