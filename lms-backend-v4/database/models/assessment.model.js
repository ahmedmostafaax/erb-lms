import mongoose from "mongoose";

const quizQuestionSchema = new mongoose.Schema(
  {
    text: { type: String, required: true },
    type: { type: String, enum: ["mcq", "truefalse", "essay", "upload"], required: true },
    options: [String],
    correctAnswer: String,
    points: { type: Number, default: 1 },
  },
  { _id: true }
);

const quizSchema = new mongoose.Schema(
  {
    course: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
    lessonId: { type: mongoose.Schema.Types.ObjectId, default: null },
    title: { type: String, required: true },
    type: { type: String, enum: ["quiz", "exam", "task"], required: true },
    durationMinutes: Number,
    questions: [quizQuestionSchema],
  },
  { timestamps: true }
);

const resultSchema = new mongoose.Schema(
  {
    score: { type: Number, required: true },
    maxScore: { type: Number, required: true },
    feedback: String,
    gradedAt: Date,
  },
  { _id: false }
);

const submissionSchema = new mongoose.Schema(
  {
    quiz: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    answers: [
      {
        questionId: mongoose.Schema.Types.ObjectId,
        answer: String,
      },
    ],
    fileUrl: String,
    status: { type: String, enum: ["submitted", "graded"], default: "submitted" },
    result: { type: resultSchema, default: null },
  },
  { timestamps: true }
);

submissionSchema.index({ quiz: 1, user: 1 });

export const Quiz = mongoose.model("Quiz", quizSchema);
export const Submission = mongoose.model("Submission", submissionSchema);
