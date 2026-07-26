import Enrollment from "../../../../database/models/enrollment.model.js";
import catchError from "../../../middleware/catchError.js";

const getMyEnrollments = catchError(async (req, res, next) => {
  const enrollments = await Enrollment.find({ user: req.user._id })
    .populate("course", "title thumbnailUrl price level instructor")
    .sort("-createdAt");

  res.status(200).json({ status: "success", results: enrollments.length, data: enrollments });
});

export default getMyEnrollments;
