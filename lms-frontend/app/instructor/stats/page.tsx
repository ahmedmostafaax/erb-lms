"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";

type Stats = {
  coursesCount: number;
  publishedCount: number;
  studentsCount: number;
  completedCount: number;
  estimatedRevenue: number;
  courses: {
    _id: string;
    title: string;
    price: number;
    enrollmentCount: number;
    ratingAvg: number;
    status?: string;
  }[];
};

type PeriodStats = {
  days: number;
  newEnrollments: number;
  coursesCount: number;
};

export default function InstructorStatsPage() {
  const { token } = useAuth();
  const [data, setData] = useState<Stats | null>(null);
  const [period, setPeriod] = useState<PeriodStats | null>(null);
  const [days, setDays] = useState(30);

  useEffect(() => {
    if (!token) return;
    apiFetch<{ data: Stats }>("/instructor/stats", { token })
      .then((res) => setData(res.data))
      .catch(() => setData(null));
  }, [token]);

  useEffect(() => {
    if (!token) return;
    apiFetch<{ data: PeriodStats }>(`/instructor/stats/period?days=${days}`, { token })
      .then((res) => setPeriod(res.data))
      .catch(() => setPeriod(null));
  }, [token, days]);

  if (!data) {
    return (
      <main className="mx-auto max-w-4xl px-6 py-16">
        <div className="h-6 w-1/3 animate-pulse rounded bg-line/40" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl flex-1 px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">إحصائيات المدرّس</h1>

      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          ["كورسات", data.coursesCount],
          ["منشورة", data.publishedCount],
          ["طلاب", data.studentsCount],
          ["مكتملين", data.completedCount],
          ["إيراد تقديري", `${data.estimatedRevenue} ج.م`],
        ].map(([label, value]) => (
          <div key={String(label)} className="rounded-xl border border-line p-3 text-center">
            <div className="font-mono text-lg font-semibold text-ink">{value as string | number}</div>
            <div className="text-xs text-ink/50">{label as string}</div>
          </div>
        ))}
      </div>

      <section className="mt-10">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="font-display text-lg font-semibold text-ink">حسب الفترة</h2>
          <div className="flex gap-2">
            {[7, 30, 90].map((d) => (
              <button
                key={d}
                type="button"
                onClick={() => setDays(d)}
                className={`rounded-full px-3 py-1.5 text-xs font-medium ${
                  days === d ? "bg-primary text-white" : "border border-line text-ink/60"
                }`}
              >
                {d} يوم
              </button>
            ))}
          </div>
        </div>

        {period && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            <div className="rounded-xl border border-line p-3 text-center">
              <div className="font-mono text-lg font-semibold">{period.newEnrollments}</div>
              <div className="text-xs text-ink/50">تسجيلات جديدة ({period.days} يوم)</div>
            </div>
            <div className="rounded-xl border border-line p-3 text-center">
              <div className="font-mono text-lg font-semibold">{period.coursesCount}</div>
              <div className="text-xs text-ink/50">كورساتك</div>
            </div>
          </div>
        )}
      </section>

      <h2 className="mt-10 font-display text-lg font-semibold text-ink">تفاصيل الكورسات</h2>
      <div className="mt-4 space-y-2">
        {data.courses.map((c) => (
          <div
            key={c._id}
            className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line bg-paper-raised p-4 text-sm"
          >
            <span className="font-medium text-ink">{c.title}</span>
            <span className="text-ink/50">
              {c.status} · {c.enrollmentCount} طالب · ★ {c.ratingAvg?.toFixed(1) ?? 0} · {c.price} ج.م
            </span>
          </div>
        ))}
        {data.courses.length === 0 && <p className="text-sm text-ink/50">لا توجد كورسات بعد</p>}
      </div>
    </main>
  );
}
