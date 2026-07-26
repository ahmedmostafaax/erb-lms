import mongoose from "mongoose";

const resourceSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    fileUrl: { type: String, required: true },
    type: { type: String, enum: ["pdf", "doc", "zip", "link", "other"], default: "other" },
  },
  { timestamps: true }
);

const lessonSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    videoUrl: String,
    durationSeconds: { type: Number, default: 0 },
    order: { type: Number, required: true },
    resources: [resourceSchema],
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", default: null },
  },
  { timestamps: true }
);

const moduleSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    order: { type: Number, required: true },
    lessons: [lessonSchema],
  },
  { timestamps: true }
);

const courseSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true },
    description: { type: String, required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    category: { type: mongoose.Schema.Types.ObjectId, ref: "Category", required: true },
    price: { type: Number, required: true, default: 0 },
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    language: { type: String, default: "ar" },
    thumbnailUrl: String,
    status: { type: String, enum: ["draft", "published", "archived"], default: "draft" },
    modules: [moduleSchema],
    ratingAvg: { type: Number, default: 0 },
    ratingCount: { type: Number, default: 0 },
    enrollmentCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

courseSchema.index({ title: "text", description: "text" });
courseSchema.index({ category: 1, level: 1, status: 1 });

export default mongoose.model("Course", courseSchema);
