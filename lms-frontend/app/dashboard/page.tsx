"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { getDashboard, type DashboardData } from "@/lib/api/profile";
import { Navbar } from "@/components/Navbar";
import { ProgressRing } from "@/components/ProgressRing";

function DashboardContent() {
  const { dict, locale } = useLanguage();
  const { token, user } = useAuth();
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getDashboard(token)
      .then((res) => setData(res.data))
      .finally(() => setLoading(false));
  }, [token]);

  const lastActivity = useMemo(() => {
    if (!data?.enrollments?.length) return null;
    return data.enrollments[0];
  }, [data]);

  const downloadPdf = async (certId: string) => {
    if (!token) return;
    const base = process.env.NEXT_PUBLIC_API_URL || "/api";
    try {
      const res = await fetch(`${base}/certificates/${certId}/pdf`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("fail");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `certificate-${certId}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert(locale === "ar" ? "تعذر تحميل PDF" : "PDF failed");
    }
  };

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-6xl flex-1 px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-ink">
          {dict.dashboard.greeting} {user?.name}
        </h1>
        <p className="mt-1 text-sm text-ink/60">{dict.dashboard.subtitle}</p>
        <Link href="/activity" className="mt-2 inline-block text-sm text-primary hover:underline">
          {locale === "ar" ? "سجل النشاط" : "Activity"}
        </Link>

        {loading ? <p className="mt-8 text-sm text-ink/50">...</p> : null}

        {data ? (
          <>
            {lastActivity ? (
              <div className="mt-6 rounded-2xl border border-primary/30 bg-primary/5 p-4">
                <p className="text-xs font-medium text-primary">
                  {locale === "ar" ? "آخر نشاط" : "Continue"}
                </p>
                <div className="mt-2 flex flex-wrap items-center justify-between gap-3">
                  <p className="font-medium text-ink">{lastActivity.course.title}</p>
                  <Link
                    href={`/learn/${lastActivity.course._id}`}
                    className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white"
                  >
                    {locale === "ar" ? "متابعة" : "Continue"}
                  </Link>
                </div>
              </div>
            ) : null}

            <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
              {[
                { label: dict.dashboard.stats.total, value: data.stats.totalCourses },
                { label: dict.dashboard.stats.completed, value: data.stats.completedCourses },
                { label: dict.dashboard.stats.inProgress, value: data.stats.inProgressCourses },
                { label: dict.dashboard.stats.hours, value: data.stats.totalLearningHours },
                { label: dict.dashboard.stats.certificates, value: data.stats.certificatesCount },
                { label: dict.dashboard.stats.badges, value: data.stats.badgesCount },
              ].map((s) => (
                <div key={s.label} className="rounded-2xl border border-line bg-paper-raised p-4">
                  <div className="font-mono text-2xl font-semibold text-ink">{s.value}</div>
                  <div className="mt-1 text-xs text-ink/60">{s.label}</div>
                </div>
              ))}
            </div>

            <section className="mt-12">
              <h2 className="font-display text-lg font-semibold text-ink">
                {dict.dashboard.myCourses}
              </h2>
              {data.enrollments.length === 0 ? (
                <p className="mt-4 text-sm text-ink/50">{dict.dashboard.noCourses}</p>
              ) : (
                <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                  {data.enrollments.map((e) => (
                    <Link
                      key={e._id}
                      href={`/learn/${e.course._id}`}
                      className="flex items-center gap-4 rounded-2xl border border-line bg-paper-raised p-4 hover:shadow-md"
                    >
                      <ProgressRing percent={e.progressPercent} />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-ink">{e.course.title}</p>
                        <p className="mt-1 text-xs text-ink/50">{e.progressPercent}%</p>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>

            <section className="mt-12 pb-16">
              <h2 className="font-display text-lg font-semibold text-ink">
                {dict.dashboard.certificates}
              </h2>
              {data.certificates.length === 0 ? (
                <p className="mt-4 text-sm text-ink/50">{dict.dashboard.noCertificates}</p>
              ) : (
                <ul className="mt-4 space-y-3">
                  {data.certificates.map((c) => (
                    <li
                      key={c._id}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-line p-3"
                    >
                      <Link
                        href={`/certificates/${c._id}`}
                        className="text-sm text-primary hover:underline"
                      >
                        {c.course.title}
                      </Link>
                      <button
                        type="button"
                        onClick={() => downloadPdf(c._id)}
                        className="rounded-full border border-line px-3 py-1 text-xs hover:border-primary"
                      >
                        PDF
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        ) : null}
      </main>
    </>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}
