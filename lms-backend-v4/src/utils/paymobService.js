import crypto from "crypto";
import paymobConfig from "../config/paymob.js";

// 1. Authentication Request
const getAuthToken = async () => {
  const res = await fetch(`${paymobConfig.baseUrl}/auth/tokens`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ api_key: paymobConfig.apiKey }),
  });
  const data = await res.json();
  return data.token;
};

// 2. Order Registration Request
const registerOrder = async (authToken, amountCents, merchantOrderId) => {
  const res = await fetch(`${paymobConfig.baseUrl}/ecommerce/orders`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      delivery_needed: false,
      amount_cents: amountCents,
      currency: "EGP",
      merchant_order_id: merchantOrderId,
      items: [],
    }),
  });
  return res.json();
};

// 3. Payment Key Request
const getPaymentKey = async (authToken, paymobOrderId, amountCents, integrationId, billingData) => {
  const res = await fetch(`${paymobConfig.baseUrl}/acceptance/payment_keys`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      auth_token: authToken,
      amount_cents: amountCents,
      expiration: 3600,
      order_id: paymobOrderId,
      billing_data: billingData,
      currency: "EGP",
      integration_id: integrationId,
    }),
  });
  const data = await res.json();
  return data.token;
};

// Wallet payment (فودافون كاش / InstaPay / اتصالات كاش) — بيرجع redirect_url للـ OTP
const payWithWallet = async (paymentKey, mobileNumber) => {
  const res = await fetch(`${paymobConfig.baseUrl}/acceptance/payments/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: { identifier: mobileNumber, subtype: "WALLET" },
      payment_token: paymentKey,
    }),
  });
  return res.json();
};

// Kiosk payment (فوري) — بيرجع bill_reference
const payWithKiosk = async (paymentKey) => {
  const res = await fetch(`${paymobConfig.baseUrl}/acceptance/payments/pay`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      source: { identifier: "AGGREGATOR", subtype: "AGGREGATOR" },
      payment_token: paymentKey,
    }),
  });
  return res.json();
};

// رابط الـ iframe بتاع الكارت
const getCardIframeUrl = (paymentKey) => {
  return `https://accept.paymob.com/api/acceptance/iframes/${paymobConfig.iframeId}?payment_token=${paymentKey}`;
};

// التأكد إن الـ webhook فعلاً جاي من Paymob مش حد بيحاول يزور طلب دفع
// ⚠️ ترتيب الحقول ده موثّق من Paymob من سنين، لكن راجعه من الداشبورد بتاعك قبل الإنتاج
const verifyHmac = (data) => {
  const orderedFields = [
    "amount_cents", "created_at", "currency", "error_occured", "has_parent_transaction",
    "id", "integration_id", "is_3d_secure", "is_auth", "is_capture", "is_refunded",
    "is_standalone_payment", "is_voided", "order.id", "owner", "pending",
    "source_data.pan", "source_data.sub_type", "source_data.type", "success",
  ];

  const concatenated = orderedFields
    .map((field) => {
      const keys = field.split(".");
      let value = data;
      keys.forEach((k) => (value = value?.[k]));
      return value;
    })
    .join("");

  const calculatedHmac = crypto
    .createHmac("sha512", paymobConfig.hmacSecret)
    .update(concatenated)
    .digest("hex");

  return calculatedHmac === data.receivedHmac;
};

export default {
  getAuthToken,
  registerOrder,
  getPaymentKey,
  payWithWallet,
  payWithKiosk,
  getCardIframeUrl,
  verifyHmac,
  integrationIds: paymobConfig.integrationIds,
};