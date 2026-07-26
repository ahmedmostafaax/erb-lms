import userRouter from "./auth/user.routes.js";
import categoryRouter from "./category/category.routes.js";
import courseRouter from "./course/course.routes.js";
import enrollmentRouter from "./enrollment/enrollment.routes.js";
import AppError from "../utils/AppError.js";
import globalError from "../middleware/globalError.js";
import courseContentRouter from "./courseContent/courseContent.routes.js";
import orderRouter from "./order/order.routes.js";
import reviewRouter from "./review/review.routes.js";
import communityRouter from "./community/community.routes.js";
import assessmentRouter from "./assessment/assessment.routes.js";
import notificationRouter from "./notification/notification.routes.js";
import profileRouter from "./profile/profile.routes.js";
import settingsRouter from "./settings/settings.routes.js";
import uploadRouter from "./upload/upload.routes.js";
import certificateRouter from "./certificate/certificate.routes.js";


const bootstrap = (app) => {
  app.use("/api/auth", userRouter);
  app.use("/api/categories", categoryRouter);
  app.use("/api/courses", courseRouter);
  app.use("/api/enrollments", enrollmentRouter);
  app.use("/api/courses/:courseId", courseContentRouter);
  app.use("/api/orders", orderRouter);
  app.use("/api/reviews", reviewRouter);
  app.use("/api/community", communityRouter);
  app.use("/api/quizzes", assessmentRouter);
  app.use("/api/notifications", notificationRouter);
  app.use("/api/profile", profileRouter);
  app.use("/api/settings", settingsRouter);
  app.use("/api/upload", uploadRouter);
  app.use("/api/certificates", certificateRouter);

  app.use((req, res, next) => {
    next(new AppError(`المسار غير موجود: ${req.originalUrl}`, 404));
  });

  app.use(globalError);
};

export default bootstrap;
