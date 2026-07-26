"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { getMyCourses } from "@/lib/api/instructorCourses";
import type { Course } from "@/lib/api/courses";

function MyCoursesContent() {
  const { dict, locale } = useLanguage();
  const { token } = useAuth();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    getMyCourses(token)
      .then((res) => setCourses(res.data))
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl flex-1 px-6 py-10">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-2xl font-bold text-ink">{dict.instructor.myCourses}</h1>
          <Link
            href="/instructor/courses/new"
            className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white hover:bg-primary-dark"
          >
            + {dict.instructor.newCourseTitle}
          </Link>
        </div>

        {loading ? (
          <div className="mt-6 space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="h-16 animate-pulse rounded-xl bg-line/40" />
            ))}
          </div>
        ) : courses.length === 0 ? (
          <p className="mt-8 text-sm text-ink/50">{dict.instructor.noCoursesYet}</p>
        ) : (
          <div className="mt-6 space-y-3">
            {courses.map((c) => (
              <Link
                key={c._id}
                href={`/instructor/courses/${c._id}/manage`}
                className="flex items-center justify-between rounded-xl border border-line bg-paper-raised p-4 transition-shadow hover:shadow-md"
              >
                <div>
                  <p className="text-sm font-medium text-ink">{c.title}</p>
                  <p className="mt-1 text-xs text-ink/50">
                    {c.enrollmentCount} {locale === "ar" ? "طالب مسجّل" : "enrolled"}
                  </p>
                </div>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-semibold ${
                    c.status === "published" ? "bg-success-soft text-success" : "bg-accent-soft text-ink"
                  }`}
                >
                  {c.status === "published" ? dict.instructor.published : dict.instructor.draft}
                </span>
              </Link>
            ))}
          </div>
        )}
      </main>
    </>
  );
}

export default function MyCoursesPage() {
  return (
    <ProtectedRoute>
      <MyCoursesContent />
    </ProtectedRoute>
  );
}
