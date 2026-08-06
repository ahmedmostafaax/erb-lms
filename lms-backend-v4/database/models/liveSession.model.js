import mongoose from "mongoose";

const liveSessionSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course" },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    meetingUrl: { type: String, required: true },
    startsAt: { type: Date, required: true },
    endsAt: { type: Date },
    status: {
      type: String,
      enum: ["scheduled", "live", "ended", "cancelled"],
      default: "scheduled",
    },
  },
  { timestamps: true }
);

export default mongoose.model("LiveSession", liveSessionSchema);
