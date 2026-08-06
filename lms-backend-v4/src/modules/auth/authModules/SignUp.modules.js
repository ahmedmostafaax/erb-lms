import User from "../../../../database/models/user.model.js";
import catchError from "../../../middleware/catchError.js";
import generateOTP from "../../../utils/generateOTP.js";
import sendEmail from "../../../utils/sendEmail.js";

const signUp = catchError(async (req, res, next) => {
  const { otp, hashedOTP } = generateOTP();

  const user = await User.create({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    role: req.body.role || "student",
    otp: {
      code: hashedOTP,
      expiresAt: Date.now() + 10 * 60 * 1000,
    },
  });

  await sendEmail({
    to: user.email,
    subject: "تأكيد بريدك الإلكتروني",
    html: `<p>كود التأكيد بتاعك هو: <b>${otp}</b></p><p>صالح لمدة 10 دقايق.</p>`,
  });

  try {
    await sendEmail({
      to: user.email,
      subject: "مرحباً بك في منصة الكورسات 🎓",
      html: `
        <div style="font-family:sans-serif;line-height:1.7;color:#0e2420">
          <h2>أهلاً ${user.name}!</h2>
          <p>سعداء بانضمامك لمنصتنا. بعد تأكيد بريدك تقدر تتصفح الكورسات وتبدأ التعلم.</p>
          <p>لو سجّلت كمدرّس، ابدأ بإنشاء كورسك الأول من لوحة المدرّس.</p>
          <p style="margin-top:24px;color:#666;font-size:13px">فريق منصة الكورسات</p>
        </div>
      `,
    });
  } catch {
    /* لا تفشل التسجيل لو الإيميل الترحيبي فشل */
  }

  res.status(201).json({
    status: "success",
    message: "تم إنشاء الحساب، تم إرسال كود التأكيد إلى بريدك الإلكتروني",
    data: { email: user.email },
  });
});

export default signUp;
