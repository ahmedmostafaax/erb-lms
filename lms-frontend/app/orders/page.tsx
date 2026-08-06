"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { apiFetch, ApiError } from "@/lib/api/client";

type Order = {
  _id: string;
  status: string;
  amount?: number;
  total?: number;
  createdAt?: string;
  course?: { _id: string; title: string; price?: number };
};

function OrdersContent() {
  const { token } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    apiFetch<{ data: Order[] }>("/orders/mine", { token })
      .then((r) => setOrders(r.data || []))
      .catch((e) => setError(e instanceof ApiError ? e.message : "فشل التحميل"))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const cancel = async (id: string) => {
    if (!token || !confirm("إلغاء الطلب؟")) return;
    try {
      await apiFetch(`/orders/${id}/cancel`, { method: "PATCH", token });
      load();
    } catch (e) {
      alert(e instanceof ApiError ? e.message : "تعذر الإلغاء");
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-3xl px-6 py-10">
        <h1 className="font-display text-2xl font-bold">طلباتي</h1>
        {error ? <p className="mt-4 text-sm text-danger">{error}</p> : null}
        {loading ? (
          <p className="mt-8 text-sm text-ink/50">...</p>
        ) : orders.length === 0 ? (
          <div className="mt-16 rounded-2xl border border-dashed border-line py-16 text-center">
            <p className="text-4xl">🧾</p>
            <p className="mt-4 text-ink/60">لا توجد طلبات</p>
            <Link href="/courses" className="mt-4 inline-block text-primary hover:underline">
              تصفح الكورسات
            </Link>
          </div>
        ) : (
          <ul className="mt-8 space-y-3">
            {orders.map((o) => (
              <li
                key={o._id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-line p-4"
              >
                <div>
                  <p className="font-medium">{o.course?.title || "كورس"}</p>
                  <p className="text-xs text-ink/50">
                    {o.status} · {o.amount ?? o.total ?? o.course?.price ?? "—"} ج.م ·{" "}
                    {o.createdAt ? new Date(o.createdAt).toLocaleString("ar-EG") : ""}
                  </p>
                </div>
                <div className="flex gap-2">
                  {o.course?._id ? (
                    <Link
                      href={`/courses/${o.course._id}`}
                      className="rounded-full border border-line px-3 py-1.5 text-xs"
                    >
                      الكورس
                    </Link>
                  ) : null}
                  {["pending", "unpaid", "created"].includes(o.status) ? (
                    <button
                      type="button"
                      onClick={() => cancel(o._id)}
                      className="rounded-full border border-danger px-3 py-1.5 text-xs text-danger"
                    >
                      إلغاء
                    </button>
                  ) : null}
                </div>
              </li>
            ))}
          </ul>
        )}
      </main>
    </>
  );
}

export default function OrdersPage() {
  return (
    <ProtectedRoute>
      <OrdersContent />
    </ProtectedRoute>
  );
}
