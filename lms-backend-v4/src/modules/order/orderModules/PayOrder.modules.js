import Order from "../../../../database/models/order.model.js";
import catchError from "../../../middleware/catchError.js";
import AppError from "../../../utils/AppError.js";
import paymobService from "../../../utils/paymobService.js";

const payOrder = catchError(async (req, res, next) => {
  const order = await Order.findById(req.params.id).populate("user", "name email phone");
  if (!order) return next(new AppError("الطلب غير موجود", 404));

  const isOwner = order.user._id.toString() === req.user._id.toString();
  if (!isOwner) return next(new AppError("مالكش صلاحية تدفع الطلب ده", 403));

  if (order.status === "paid") {
    return next(new AppError("الطلب ده متدفوع بالفعل", 400));
  }

  const amountCents = Math.round(order.amount * 100);
  const authToken = await paymobService.getAuthToken();

  // نسجل الطلب على Paymob مرة واحدة بس، لو حاول يدفع تاني نستخدم نفس paymobOrderId
  let paymobOrderId = order.paymobOrderId;
  if (!paymobOrderId) {
    const paymobOrder = await paymobService.registerOrder(authToken, amountCents, order._id.toString());
    paymobOrderId = paymobOrder.id;
    order.paymobOrderId = paymobOrderId;
  }

  const billingData = {
    first_name: order.user.name?.split(" ")[0] || "NA",
    last_name: order.user.name?.split(" ")[1] || "NA",
    email: order.user.email,
    phone_number: order.user.phone || "01000000000",
    apartment: "NA", floor: "NA", street: "NA", building: "NA",
    city: "Cairo", country: "EG", state: "NA",
  };

  // ... داخل الدالة payOrder بعد استخراج integrationId
const integrationId = paymobService.integrationIds[req.body.method];
if (!integrationId) {
  return next(new AppError("طريقة الدفع غير مدعومة", 400));
}
// استخدم integrationId في getPaymentKey
const paymentKey = await paymobService.getPaymentKey(
  authToken,
  paymobOrderId,
  amountCents,
  integrationId, // الآن مضمون أنه موجود
  billingData
);

  order.payment = { method: req.body.method, status: "pending" };
  await order.save();

  if (req.body.method === "card") {
    const iframeUrl = paymobService.getCardIframeUrl(paymentKey);
    return res.status(200).json({ status: "success", data: { paymentUrl: iframeUrl } });
  }

  if (req.body.method === "wallet") {
    const result = await paymobService.payWithWallet(paymentKey, req.body.mobileNumber);
    return res.status(200).json({
      status: "success",
      data: { redirectUrl: result.redirect_url || null, message: "أكّد الدفع من تطبيق المحفظة بتاعتك" },
    });
  }

  if (req.body.method === "kiosk") {
    const result = await paymobService.payWithKiosk(paymentKey);
    order.payment.billReference = result.data?.bill_reference;
    await order.save();
    return res.status(200).json({
      status: "success",
      data: { billReference: result.data?.bill_reference, message: "ادفع الكود ده في أي فرع فوري" },
    });
  }
});

export default payOrder;