"use client";

import { useCallback, useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch, ApiError } from "@/lib/api/client";

type Order = {
  _id: string;
  status: string;
  amount?: number;
  total?: number;
  note?: string;
  user?: { name?: string; email?: string };
  course?: { title?: string };
  createdAt?: string;
};

export default function AdminOrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [err, setErr] = useState<string | null>(null);

  const load = useCallback(() => {
    if (!token) return;
    apiFetch<{ data: Order[] }>("/orders/all", { token })
      .then((r) => setOrders(r.data || []))
      .catch((e) => setErr(e instanceof ApiError ? e.message : "فشل"));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const confirm = async (id: string) => {
    if (!token || !confirm("تأكيد الدفع وتسجيل الطالب؟")) return;
    try {
      await apiFetch(`/orders/${id}/confirm`, { method: "PATCH", token });
      load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "فشل");
    }
  };

  return (
    <main className="px-6 py-8">
      <h1 className="font-display text-2xl font-bold">الطلبات</h1>
      {err ? <p className="mt-2 text-sm text-danger">{err}</p> : null}
      <div className="mt-6 space-y-3">
        {orders.map((o) => (
          <div
            key={o._id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-line p-4 text-sm"
          >
            <div>
              <p className="font-medium">{o.course?.title || "—"}</p>
              <p className="text-xs text-ink/50">
                {o.user?.name} · {o.user?.email} · {o.status} ·{" "}
                {o.amount ?? o.total ?? "—"} ج.م
              </p>
              {o.note ? <p className="mt-1 text-xs">ملاحظة: {o.note}</p> : null}
            </div>
            {["pending", "unpaid", "created"].includes(o.status) ? (
              <button
                type="button"
                onClick={() => confirm(o._id)}
                className="rounded-xl bg-primary px-4 py-2 text-xs font-semibold text-white"
              >
                تأكيد الدفع
              </button>
            ) : (
              <span className="text-xs text-ink/40">تم</span>
            )}
          </div>
        ))}
        {orders.length === 0 ? <p className="text-sm text-ink/50">لا طلبات</p> : null}
      </div>
    </main>
  );
}
