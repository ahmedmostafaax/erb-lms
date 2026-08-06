import express from "express";
import LessonNote from "../../../database/models/lessonNote.model.js";
import { protect } from "../../middleware/auth.js";
import catchError from "../../middleware/catchError.js";

const router = express.Router();
router.use(protect);

router.get(
  "/",
  catchError(async (req, res) => {
    const { courseId, lessonId } = req.query;
    const note = await LessonNote.findOne({
      user: req.user._id,
      course: courseId,
      lessonId,
    });
    res.json({ status: "success", data: note });
  })
);

router.put(
  "/",
  catchError(async (req, res) => {
    const { courseId, lessonId, body } = req.body;
    const note = await LessonNote.findOneAndUpdate(
      { user: req.user._id, course: courseId, lessonId },
      { body: body || "" },
      { upsert: true, new: true }
    );
    res.json({ status: "success", data: note });
  })
);

export default router;
