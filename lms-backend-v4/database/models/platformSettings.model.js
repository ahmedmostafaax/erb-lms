import mongoose from "mongoose";

const schema = new mongoose.Schema(
  {
    platformName: { type: String, default: "منصة الكورسات" },
    supportEmail: { type: String, default: "" },
  },
  { timestamps: true }
);

export default mongoose.model("PlatformSettings", schema);
