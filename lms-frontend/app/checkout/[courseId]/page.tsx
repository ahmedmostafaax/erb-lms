"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { apiFetch, ApiError } from "@/lib/api/client";

type Course = { _id: string; title: string; price: number };

function CheckoutContent() {
  const { courseId } = useParams<{ courseId: string }>();
  const { token } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<Course | null>(null);
  const [note, setNote] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [err, setErr] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    apiFetch<{ data: Course }>(`/courses/${courseId}`)
      .then((r) => setCourse(r.data))
      .catch(() => setErr("الكورس غير موجود"));
  }, [courseId]);

  const placeOrder = async () => {
    if (!token || !course) return;
    setLoading(true);
    setErr(null);
    try {
      await apiFetch("/orders/manual", {
        method: "POST",
        token,
        body: { courseId: course._id, note },
      });
      setMsg("تم إنشاء الطلب. بعد التحويل الأدمن هيأكد التسجيل.");
      setTimeout(() => router.push("/orders"), 1500);
    } catch (e) {
      setErr(e instanceof ApiError ? e.message : "فشل إنشاء الطلب");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-lg px-6 py-10">
        <h1 className="font-display text-2xl font-bold">إتمام الطلب</h1>
        {course ? (
          <div className="mt-6 rounded-2xl border border-line p-5">
            <p className="font-medium">{course.title}</p>
            <p className="mt-2 font-mono text-xl text-primary">{course.price} ج.م</p>
            <p className="mt-4 text-sm text-ink/60">
              ادفع بتحويل بنكي / محفظة، ثم اكتب رقم العملية. الأدمن هيأكد طلبك.
            </p>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="ملاحظات / رقم التحويل (اختياري)"
              rows={3}
              className="mt-4 w-full rounded-xl border border-line px-3 py-2 text-sm"
            />
            {err ? <p className="mt-3 text-sm text-danger">{err}</p> : null}
            {msg ? <p className="mt-3 text-sm text-primary">{msg}</p> : null}
            <button
              type="button"
              disabled={loading}
              onClick={placeOrder}
              className="mt-4 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white disabled:opacity-50"
            >
              {loading ? "..." : "تأكيد الطلب"}
            </button>
            <Link href="/orders" className="mt-3 block text-center text-sm text-primary">
              طلباتي
            </Link>
          </div>
        ) : (
          <p className="mt-8 text-sm text-ink/50">{err || "..."}</p>
        )}
      </main>
    </>
  );
}

export default function CheckoutPage() {
  return (
    <ProtectedRoute>
      <CheckoutContent />
    </ProtectedRoute>
  );
}
