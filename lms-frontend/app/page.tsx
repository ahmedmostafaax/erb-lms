"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { getDashboard } from "@/lib/api/profile";
import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { Skeleton } from "@/components/Skeleton";
import { getCourses, type Course } from "@/lib/api/courses";

export default function Home() {
  const { token } = useAuth();
  const [continueCourse, setContinueCourse] = useState<{ _id: string; title: string } | null>(null);

  const { dict, locale } = useLanguage();
  const [featured, setFeatured] = useState<Course[]>([]);
  const [latest, setLatest] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      getCourses({ limit: 6, sort: "-ratingAvg" }),
      getCourses({ limit: 3, sort: "-createdAt" }),
    ])
      .then(([f, l]) => {
        setFeatured(f.data);
        setLatest(l.data);
      })
      .catch(() => {
        setFeatured([]);
        setLatest([]);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pb-16 pt-16 md:pt-24">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">
              {dict.hero.eyebrow}
            </span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ink md:text-5xl">
              {dict.hero.title}
            </h1>
            <p className="mt-5 text-lg leading-relaxed text-ink/70">{dict.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/courses"
                className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white hover:bg-primary-dark"
              >
                {dict.hero.cta}
              </Link>
              <Link
                href="/paths"
                className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink hover:border-primary"
              >
                {locale === "ar" ? "المسارات" : "Paths"}
              </Link>
            </div>
          </div>
        </section>

        {/* continue learning */}
        {token && continueCourse && (
          <section className="mx-auto max-w-6xl px-6 pb-8">
            <div className="rounded-2xl border border-primary/30 bg-primary/5 p-5 flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="text-xs font-medium text-primary">كمّل التعلم</p>
                <p className="font-medium text-ink">{continueCourse.title}</p>
              </div>
              <Link href={`/learn/${continueCourse._id}`} className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white">
                متابعة
              </Link>
            </div>
          </section>
        )}

        <section className="mx-auto max-w-6xl px-6 pb-16">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-accent">
                {locale === "ar" ? "الأعلى تقييماً" : "Top rated"}
              </span>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink">
                {locale === "ar" ? "كورسات مميزة" : "Featured courses"}
              </h2>
            </div>
            <Link href="/courses" className="text-sm font-medium text-primary hover:underline">
              {dict.coursesSection.viewAll}
            </Link>
          </div>
          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <Skeleton key={i} className="h-64 rounded-2xl" />
              ))}
            </div>
          ) : featured.length === 0 ? (
            <p className="text-sm text-ink/50">{dict.coursesSection.empty}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {featured.slice(0, 6).map((course, index) => (
                <CourseCard key={course._id} course={course} index={index} />
              ))}
            </div>
          )}
        </section>

        <section id="courses" className="mx-auto max-w-6xl px-6 pb-24">
          <h2 className="font-display text-2xl font-bold text-ink">
            {locale === "ar" ? "أحدث الكورسات" : "Latest"}
          </h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {latest.map((course, index) => (
              <CourseCard key={course._id} course={course} index={index} />
            ))}
          </div>
        </section>
      </main>
      <footer className="border-t border-line py-8">
        <div className="mx-auto max-w-6xl px-6 text-center text-sm text-ink/50">
          © {new Date().getFullYear()} {dict.footer.rights}
        </div>
      </footer>
    </>
  );
}
