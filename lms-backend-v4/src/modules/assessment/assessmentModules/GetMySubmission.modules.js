import { Submission } from "../../../../database/models/assessment.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const getMySubmission = catchError(async (req, res, next) => {
  const submission = await Submission.findOne({ quiz: req.params.id, user: req.user._id });
  if (!submission) return next(new AppError("لسه ما سلّمتش الاختبار ده", 404));

  res.status(200).json({ status: "success", data: submission });
});

export default getMySubmission;