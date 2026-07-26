import express from "express";
const router = express.Router();

import validation from "../../middleware/validation.js";
import emailExist from "../../middleware/emailExist.js";
import {
  signUpSchema,
  signInSchema,
  verifyEmailSchema,
  resendOtpSchema,
  forgotPasswordSchema,
  resetPasswordSchema,
  googleAuthSchema,
} from "./user.validation.js";
import signUp from "./authModules/SignUp.modules.js";
import signIn from "./authModules/SignIn.modules.js";
import verifyEmail from "./authModules/VerifyEmail.modules.js";
import resendOTP from "./authModules/ResendOTP.modules.js";
import forgotPassword from "./authModules/ForgotPassword.modules.js";
import resetPassword from "./authModules/ResetPassword.modules.js";
import googleAuth from "./authModules/GoogleAuth.modules.js";

router.post("/signup", validation(signUpSchema), emailExist, signUp);
router.post("/signin", validation(signInSchema), signIn);
router.post("/verify-email", validation(verifyEmailSchema), verifyEmail);
router.post("/resend-otp", validation(resendOtpSchema), resendOTP);
router.post("/forgot-password", validation(forgotPasswordSchema), forgotPassword);
router.post("/reset-password", validation(resetPasswordSchema), resetPassword);
router.post("/google", validation(googleAuthSchema), googleAuth);

export default router;