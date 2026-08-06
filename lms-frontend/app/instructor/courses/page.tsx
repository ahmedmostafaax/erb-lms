"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch, ApiError } from "@/lib/api/client";
import { getMyCourses, type Course } from "@/lib/api/courses";

const statusLabel: Record<string, string> = {
  draft: "مسودة",
  pending: "قيد المراجعة",
  published: "منشور",
  rejected: "مرفوض",
};

export default function InstructorCoursesPage() {
  const { locale } = useLanguage();
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");
  const [error, setError] = useState<string | null>(null);

  const loadCourses = useCallback(() => {
    if (!token) return;
    setLoading(true);
    getMyCourses(token)
      .then((res) => setCourses(res.data || []))
      .catch((e) => setError(e instanceof ApiError ? e.message : "فشل التحميل"))
      .finally(() => setLoading(false));
  }, [token]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses]);

  const filtered = useMemo(() => {
    if (!statusFilter) return courses;
    return courses.filter((c) => c.status === statusFilter);
  }, [courses, statusFilter]);

  const cloneCourse = async (courseId: string) => {
    if (!token || !confirm("نسخ الكورس كمسودة؟")) return;
    try {
      await apiFetch(`/instructor/courses/${courseId}/clone`, {
        method: "POST",
        token,
      });
      loadCourses();
    } catch (err) {
      alert(err instanceof ApiError ? err.message : "فشل النسخ");
    }
  };

  return (
    <main className="px-6 py-8">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="font-display text-2xl font-bold text-ink">
            {locale === "ar" ? "كورساتي" : "My courses"}
          </h1>
          <p className="mt-1 text-sm text-ink/60">
            {locale === "ar" ? "إدارة ونشر كورساتك" : "Manage your courses"}
          </p>
        </div>
        <Link
          href="/instructor/courses/new"
          className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
        >
          {locale === "ar" ? "كورس جديد" : "New course"}
        </Link>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {[
          { v: "", ar: "الكل" },
          { v: "draft", ar: "مسودة" },
          { v: "pending", ar: "قيد المراجعة" },
          { v: "published", ar: "منشور" },
          { v: "rejected", ar: "مرفوض" },
        ].map((s) => (
          <button
            key={s.v || "all"}
            type="button"
            onClick={() => setStatusFilter(s.v)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium ${
              statusFilter === s.v
                ? "bg-primary text-white"
                : "border border-line text-ink/70"
            }`}
          >
            {s.ar}
          </button>
        ))}
      </div>

      {error && <p className="mt-4 text-sm text-danger">{error}</p>}

      {loading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-line/40" />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="mt-16 rounded-2xl border border-dashed border-line px-6 py-16 text-center">
          <p className="text-4xl">📚</p>
          <p className="mt-4 font-medium text-ink">
            {statusFilter
              ? "لا توجد كورسات بهذه الحالة"
              : "لسه ما عندكش كورسات"}
          </p>
          <p className="mt-2 text-sm text-ink/50">ابدأ بإنشاء كورسك الأول</p>
          <Link
            href="/instructor/courses/new"
            className="mt-6 inline-block rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white"
          >
            إنشاء كورس
          </Link>
        </div>
      ) : (
        <div className="mt-8 space-y-3">
          {filtered.map((c) => (
            <div
              key={c._id}
              className="flex flex-col gap-3 rounded-2xl border border-line bg-paper-raised p-4 sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="min-w-0">
                <p className="font-medium text-ink">{c.title}</p>
                <p className="mt-1 text-xs text-ink/50">
                  <span className="rounded-full bg-line/60 px-2 py-0.5 font-mono">
                    {(c.status && statusLabel[c.status]) || c.status || "—"}
                  </span>
                  {" · "}
                  {c.price} ج.م · ★ {c.ratingAvg} ({c.ratingCount})
                </p>
                {c.status === "pending" && (
                  <p className="mt-2 rounded-lg bg-accent/15 px-3 py-1.5 text-xs text-ink">
                    كورسك قيد المراجعة — الأدمن هيراجع وينشر أو يرفض
                  </p>
                )}
                {c.status === "rejected" && (
                  <p className="mt-2 rounded-lg bg-danger/10 px-3 py-1.5 text-xs text-danger">
                    مرفوض
                    {(c as { rejectionReason?: string }).rejectionReason
                      ? `: ${(c as { rejectionReason?: string }).rejectionReason}`
                      : " — عدّل وأعد الإرسال"}
                  </p>
                )}
              </div>
              <div className="flex flex-wrap gap-2">
                <Link
                  href={`/instructor/courses/${c._id}/manage`}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:border-primary"
                >
                  إدارة
                </Link>
                <button
                  type="button"
                  onClick={() => cloneCourse(c._id)}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:border-primary"
                >
                  نسخ
                </button>
                <Link
                  href={`/courses/${c._id}`}
                  className="rounded-full border border-line px-3 py-1.5 text-xs font-medium hover:border-primary"
                >
                  معاينة
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
