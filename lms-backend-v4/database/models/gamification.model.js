import mongoose from "mongoose";

const badgeSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
    iconUrl: String,
    criteria: String,
  },
  { timestamps: true }
);

const skillSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, unique: true },
  },
  { timestamps: true }
);

export const Badge = mongoose.model("Badge", badgeSchema);
export const Skill = mongoose.model("Skill", skillSchema);
