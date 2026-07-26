import mongoose from "mongoose";

const enrollmentSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    status: { type: String, enum: ["active", "completed", "dropped"], default: "active" },
    progressPercent: { type: Number, default: 0, min: 0, max: 100 },
    lastLessonId: { type: mongoose.Schema.Types.ObjectId, default: null },
    completedLessonIds: [{ type: mongoose.Schema.Types.ObjectId }],
    certificateIssued: { type: Boolean, default: false },
  },
  { timestamps: true }
);

enrollmentSchema.index({ user: 1, course: 1 }, { unique: true });

export default mongoose.model("Enrollment", enrollmentSchema);
