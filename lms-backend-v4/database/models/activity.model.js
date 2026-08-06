import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    type: {
      type: String,
      enum: ["lesson_complete", "quiz_submit", "enroll", "login", "review"],
      required: true,
    },
    message: { type: String, required: true },
    meta: { type: Object, default: {} },
  },
  { timestamps: true }
);

activitySchema.index({ user: 1, createdAt: -1 });

export default mongoose.model("Activity", activitySchema);
