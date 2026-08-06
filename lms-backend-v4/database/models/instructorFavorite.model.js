import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    instructor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  },
  { timestamps: true }
);
schema.index({ user: 1, instructor: 1 }, { unique: true });

export default mongoose.model("InstructorFavorite", schema);
