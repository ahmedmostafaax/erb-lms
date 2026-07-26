import { apiFetch } from "./client";

type Order = { _id: string; amount: number; status: string; paymobOrderId?: string };

export function createOrder(courseId: string, token: string) {
  return apiFetch<{ status: string; data: Order }>("/orders", {
    method: "POST",
    body: { courseId },
    token,
  });
}

type PayResult = {
  status: string;
  data: { paymentUrl?: string; redirectUrl?: string; billReference?: string; message?: string };
};

export function payOrder(
  orderId: string,
  payload: { method: "card" | "wallet" | "kiosk"; mobileNumber?: string },
  token: string
) {
  return apiFetch<PayResult>(`/orders/${orderId}/pay`, { method: "POST", body: payload, token });
}
