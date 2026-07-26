import { OAuth2Client } from "google-auth-library";
import jwt from "jsonwebtoken";
import User from "../../../../database/models/user.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const googleAuth = catchError(async (req, res, next) => {
  const { idToken } = req.body;

  const ticket = await client.verifyIdToken({
    idToken,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();

  if (!payload || !payload.email_verified) {
    return next(new AppError("فشل التحقق من حساب جوجل", 401));
  }

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    user = await User.create({
      name: payload.name,
      email: payload.email,
      avatarUrl: payload.picture,
      authProvider: "google",
      googleId: payload.sub,
      isEmailVerified: true,
      role: "student",
    });
  } else if (user.authProvider !== "google") {
    user.authProvider = "google";
    user.googleId = payload.sub;
    user.isEmailVerified = true;
    await user.save();
  }

  const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

  res.status(200).json({ status: "success", token, data: user });
});

export default googleAuth;