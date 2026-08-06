"use client";

import { useEffect, useState } from "react";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";
import { Alert } from "@/components/Alert";

type Coupon = {
  _id: string;
  code: string;
  discountType: "percent" | "fixed";
  value: number;
  maxUses?: number | null;
  usedCount?: number;
  isActive?: boolean;
};

function Content() {
  const { token, user } = useAuth();
  const [list, setList] = useState<Coupon[]>([]);
  const [code, setCode] = useState("");
  const [discountType, setDiscountType] = useState<"percent" | "fixed">("percent");
  const [value, setValue] = useState("10");
  const [maxUses, setMaxUses] = useState("");
  const [msg, setMsg] = useState<string | null>(null);

  const load = () => {
    if (!token) return;
    apiFetch<{ data: Coupon[] }>("/coupons", { token })
      .then((r) => setList(r.data))
      .catch(() => setList([]));
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token]);

  if (user && user.role !== "admin") {
    return (
      <>
        <main className="px-6 py-16 text-center text-sm text-ink/50">للأدمن فقط</main>
      </>
    );
  }

  const create = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    await apiFetch("/coupons", {
      method: "POST",
      token,
      body: {
        code,
        discountType,
        value: Number(value),
        maxUses: maxUses ? Number(maxUses) : null,
      },
    });
    setCode("");
    setMsg("تم الإنشاء");
    load();
  };

  const remove = async (id: string) => {
    if (!token || !confirm("حذف الكوبون؟")) return;
    await apiFetch(`/coupons/${id}`, { method: "DELETE", token });
    load();
  };

  return (
    <>
      <main className="mx-auto max-w-2xl px-6 py-10">
        <h1 className="font-display text-2xl font-bold">كوبونات الخصم</h1>
        {msg && (
          <div className="mt-4">
            <Alert type="success" message={msg} />
          </div>
        )}
        <form onSubmit={create} className="mt-6 space-y-3 rounded-xl border border-line p-4">
          <input
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="CODE"
            required
            className="w-full rounded-xl border border-line px-3 py-2 text-sm uppercase"
          />
          <select
            value={discountType}
            onChange={(e) => setDiscountType(e.target.value as "percent" | "fixed")}
            className="w-full rounded-xl border border-line px-3 py-2 text-sm"
          >
            <option value="percent">نسبة %</option>
            <option value="fixed">مبلغ ثابت</option>
          </select>
          <input
            type="number"
            value={value}
            onChange={(e) => setValue(e.target.value)}
            className="w-full rounded-xl border border-line px-3 py-2 text-sm"
          />
          <input
            type="number"
            value={maxUses}
            onChange={(e) => setMaxUses(e.target.value)}
            placeholder="أقصى استخدام (اختياري)"
            className="w-full rounded-xl border border-line px-3 py-2 text-sm"
          />
          <button type="submit" className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white">
            إنشاء
          </button>
        </form>
        <div className="mt-6 space-y-2">
          {list.map((c) => (
            <div key={c._id} className="flex justify-between rounded-xl border border-line p-3 text-sm">
              <span>
                {c.code} · {c.discountType} {c.value} · استخدم {c.usedCount || 0}
                {c.maxUses != null ? `/${c.maxUses}` : ""}
              </span>
              <button type="button" onClick={() => remove(c._id)} className="text-xs text-danger">
                حذف
              </button>
            </div>
          ))}
        </div>
      </main>
    </>
  );
}

export default function AdminCouponsPage() {
  return (
    <ProtectedRoute>
      <Content />
    </ProtectedRoute>
  );
}
