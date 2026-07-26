import Notification from "../../database/models/notification.model.js";

/**
 * دالة لإنشاء إشعار جديد
 * @param {Object} params
 * @param {string} params.userId - معرف المستخدم
 * @param {string} params.type - نوع الإشعار (enrollment, payment, grading, community, system)
 * @param {string} params.message - نص الإشعار
 * @param {string} [params.link] - رابط اختياري
 */
const createNotification = async ({ userId, type, message, link }) => {
  await Notification.create({ user: userId, type, message, link });
};

export default createNotification;