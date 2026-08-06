import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    lessonId: { type: String, required: true },
    body: { type: String, default: "" },
  },
  { timestamps: true }
);
schema.index({ user: 1, course: 1, lessonId: 1 }, { unique: true });

export default mongoose.model("LessonNote", schema);
