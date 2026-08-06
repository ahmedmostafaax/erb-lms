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
import activityRouter from "./activity/activity.routes.js";
import instructorFavoriteRouter from "./instructorFavorite/instructorFavorite.routes.js";
import certificatePdfRouter from "./certificate/certificatePdf.routes.js";
import adminRouter from "./admin/admin.routes.js";
import wishlistRouter from "./wishlist/wishlist.routes.js";
import couponRouter from "./coupon/coupon.routes.js";
import instructorRouter from "./instructor/instructor.routes.js";
import learningPathRouter from "./learningPath/learningPath.routes.js";
import instructorReviewRouter from "./instructorReview/instructorReview.routes.js";
import liveRouter from "./live/live.routes.js";
import messageRouter from "./message/message.routes.js";
import lessonNotesRouter from "./lessonNotes/lessonNotes.routes.js";

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
  app.use("/api/certificates", certificatePdfRouter);
  app.use("/api/certificates", certificateRouter);
  app.use("/api/activity", activityRouter);
  app.use("/api/admin", adminRouter);
  app.use("/api/wishlist", wishlistRouter);
  app.use("/api/coupons", couponRouter);
  app.use("/api/instructor", instructorRouter);
  app.use("/api/paths", learningPathRouter);
  app.use("/api/instructor-reviews", instructorReviewRouter);
  app.use("/api/messages", messageRouter);
  app.use("/api/live", liveRouter);

    app.use("/api/instructor-favorites", instructorFavoriteRouter);

  app.use("/api/lesson-notes", lessonNotesRouter);

  app.use((req, res, next) => {
    next(new AppError(`المسار غير موجود: ${req.originalUrl}`, 404));
  });


  app.use(globalError);
};

export default bootstrap;