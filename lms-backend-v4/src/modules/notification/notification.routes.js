import express from "express";
const router = express.Router();

import validation from "../../middleware/validation.js";
import { protect } from "../../middleware/auth.js";
import { notificationIdSchema } from "./notification.validation.js";

import getMyNotifications from "./notificationModules/GetMyNotifications.modules.js";
import markAsRead from "./notificationModules/MarkAsRead.modules.js";
import markAllAsRead from "./notificationModules/MarkAllAsRead.modules.js";
import deleteNotification from "./notificationModules/DeleteNotification.modules.js";

router.use(protect); // كل حاجة هنا محتاجة تسجيل دخول

router.get("/", getMyNotifications);
router.patch("/read-all", markAllAsRead);
router.patch("/:id/read", validation(notificationIdSchema), markAsRead);
router.delete("/:id", validation(notificationIdSchema), deleteNotification);

export default router;