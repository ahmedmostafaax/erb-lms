import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    lessonId: { type: String, required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    seconds: { type: Number, default: 0 },
  },
  { timestamps: true }
);
schema.index({ course: 1, lessonId: 1, user: 1 }, { unique: true });

export default mongoose.model("LessonView", schema);
