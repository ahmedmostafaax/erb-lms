import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const profileSchema = new mongoose.Schema(
  {
    bio: { type: String, default: "" },
    cvUrl: String,
    linkedinUrl: String,
    portfolioUrl: String,
    level: { type: String, enum: ["beginner", "intermediate", "advanced"], default: "beginner" },
    totalLearningHours: { type: Number, default: 0 },
    skills: [{ type: mongoose.Schema.Types.ObjectId, ref: "Skill" }],
    // تخصصات/مجالات المدرب (بتستخدم نفس التصنيفات المستخدمة في الكورسات)
    specialties: [{ type: mongoose.Schema.Types.ObjectId, ref: "Category" }],
    badges: [
      {
        badge: { type: mongoose.Schema.Types.ObjectId, ref: "Badge" },
        earnedAt: { type: Date, default: Date.now },
      },
    ],
  },
  { _id: false }
);

const settingsSchema = new mongoose.Schema(
  {
    notificationsEnabled: { type: Boolean, default: true },
    privacyLevel: { type: String, enum: ["public", "private"], default: "public" },
    language: { type: String, default: "ar" },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, minlength: 6, select: false },
    role: { type: String, enum: ["student", "instructor", "admin"], default: "student" },
    phone: String,
    avatarUrl: String,
    authProvider: { type: String, enum: ["local", "google"], default: "local" },
    googleId: { type: String, default: null },
    profile: { type: profileSchema, default: () => ({}) },
    settings: { type: settingsSchema, default: () => ({}) },
    isEmailVerified: { type: Boolean, default: false },
    otp: {
      code: String,
      expiresAt: Date,
    },
    passwordResetCode: {
      code: String,
      expiresAt: Date,
    },
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

userSchema.methods.comparePassword = function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

export default mongoose.model("User", userSchema);
