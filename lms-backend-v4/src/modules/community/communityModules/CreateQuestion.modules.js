import { Question } from "../../../../database/models/community.model.js";
import catchError from "../../../middleware/catchError.js";
import checkEnrollment from "../../../utils/checkEnrollment.js";

const createQuestion = catchError(async (req, res, next) => {
  await checkEnrollment(req.body.courseId, req.user);

  const question = await Question.create({
    course: req.body.courseId,
    user: req.user._id,
    title: req.body.title,
    body: req.body.body,
  });

  res.status(201).json({ status: "success", data: question });
});

export default createQuestion;