"use client";

import { useEffect, useState } from "react";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { getCourses, type Course } from "@/lib/api/courses";

export default function Home() {
  const { dict } = useLanguage();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCourses({ limit: 3, sort: "-createdAt" })
      .then((res) => setCourses(res.data))
      .catch(() => setCourses([]))
      .finally(() => setLoading(false));
  }, []);

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <section className="mx-auto max-w-6xl px-6 pb-20 pt-16 md:pt-24">
          <div className="max-w-2xl">
            <span className="font-mono text-xs uppercase tracking-wider text-primary">{dict.hero.eyebrow}</span>
            <h1 className="mt-4 font-display text-4xl font-bold leading-tight text-ink md:text-5xl">{dict.hero.title}</h1>
            <p className="mt-5 text-lg leading-relaxed text-ink/70">{dict.hero.subtitle}</p>
            <div className="mt-8 flex flex-wrap items-center gap-4">
              <a href="#courses" className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark">{dict.hero.cta}</a>
              <a href="#" className="rounded-full border border-line px-6 py-3 text-sm font-semibold text-ink transition-colors hover:border-primary">{dict.hero.secondaryCta}</a>
            </div>
          </div>
        </section>

        <section id="courses" className="mx-auto max-w-6xl px-6 pb-24">
          <div className="mb-8 flex items-end justify-between">
            <div>
              <span className="font-mono text-xs uppercase tracking-wider text-accent">{dict.coursesSection.subtitle}</span>
              <h2 className="mt-2 font-display text-2xl font-bold text-ink">{dict.coursesSection.title}</h2>
            </div>
            <a href="/courses" className="text-sm font-medium text-primary hover:underline">{dict.coursesSection.viewAll}</a>
          </div>

          {loading ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {Array.from({ length: 3 }).map((_, i) => (
                <div key={i} className="h-64 animate-pulse rounded-2xl bg-line/40" />
              ))}
            </div>
          ) : courses.length === 0 ? (
            <p className="text-sm text-ink/50">{dict.coursesSection.empty}</p>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {courses.map((course, index) => (
                <CourseCard key={course._id} course={course} index={index} />
              ))}
            </div>
          )}
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
