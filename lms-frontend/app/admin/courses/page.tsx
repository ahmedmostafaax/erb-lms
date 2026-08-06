"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch, ApiError } from "@/lib/api/client";
import { Alert } from "@/components/Alert";

type CourseRow = {
  _id: string;
  title: string;
  status: string;
  price: number;
  rejectionReason?: string;
  instructor?: { _id: string; name: string; email?: string };
  category?: { name: string };
};

export default function AdminCoursesPage() {
  const { token } = useAuth();
  const [pending, setPending] = useState<CourseRow[]>([]);
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(() => {
    if (!token) return;
    setLoading(true);
    apiFetch<{ data: CourseRow[] }>("/admin/courses/pending", { token })
      .then((p) => setPending(p.data || []))
      .catch((e) => setErr(e instanceof ApiError ? e.message : "فشل التحميل"))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    load();
  }, [load]);

  const approve = async (id: string) => {
    if (!token) return;
    try {
      await apiFetch(`/admin/courses/${id}/approve`, { method: "PATCH", token });
      setMsg("تم قبول الكورس");
      load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "خطأ");
    }
  };

  const reject = async (id: string) => {
    if (!token) return;
    const reason = prompt("سبب الرفض (يظهر للمدرّس):");
    if (reason === null) return;
    try {
      await apiFetch(`/admin/courses/${id}/reject`, {
        method: "PATCH",
        token,
        body: { reason: reason.trim() },
      });
      setMsg("تم رفض الكورس");
      load();
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "خطأ");
    }
  };

  return (
    <main className="px-6 py-8">
      <h1 className="font-display text-2xl font-bold text-ink">مراجعة الكورسات</h1>
      <p className="mt-1 text-sm text-ink/60">قبول أو رفض مع ذكر السبب</p>
      {msg && (
        <div className="mt-4">
          <Alert type="success" message={msg} />
        </div>
      )}
      {err && (
        <div className="mt-4">
          <Alert type="error" message={err} />
        </div>
      )}
      {loading ? (
        <p className="mt-8 text-sm text-ink/50">...</p>
      ) : pending.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-line py-16 text-center">
          <p className="text-4xl">✅</p>
          <p className="mt-4 text-ink/60">لا توجد كورسات قيد المراجعة</p>
        </div>
      ) : (
        <div className="mt-6 space-y-3">
          {pending.map((c) => (
            <div
              key={c._id}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-paper-raised p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-medium">{c.title}</p>
                <p className="text-xs text-ink/50">
                  {c.instructor?.name} · {c.price} ج.م
                </p>
                <Link href={`/courses/${c._id}`} className="text-xs text-primary hover:underline">
                  معاينة
                </Link>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => approve(c._id)}
                  className="rounded-xl bg-primary px-4 py-2 text-sm font-semibold text-white"
                >
                  قبول
                </button>
                <button
                  type="button"
                  onClick={() => reject(c._id)}
                  className="rounded-xl border border-danger px-4 py-2 text-sm font-semibold text-danger"
                >
                  رفض
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
