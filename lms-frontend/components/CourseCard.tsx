"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import type { Course } from "@/lib/api/courses";

const levelLabels: Record<string, { ar: string; en: string }> = {
  beginner: { ar: "مبتدئ", en: "Beginner" },
  intermediate: { ar: "متوسط", en: "Intermediate" },
  advanced: { ar: "متقدم", en: "Advanced" },
};

const palette = ["#1B6B5A", "#123F35", "#0E2420"];

export function CourseCard({ course, index = 0 }: { course: Course; index?: number }) {
  const { locale, dict } = useLanguage();
  const color = palette[index % palette.length];

  return (
    <Link
      href={`/courses/${course._id}`}
      className="group block overflow-hidden rounded-2xl border border-line bg-paper-raised transition-shadow hover:shadow-lg hover:shadow-ink/5"
    >
      <div
        className="flex h-32 items-end p-4"
        style={
          course.thumbnailUrl
            ? {
                backgroundImage: `url(${course.thumbnailUrl})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
              }
            : { background: `linear-gradient(135deg, ${color}, var(--primary-dark))` }
        }
      >
        <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {levelLabels[course.level]?.[locale] ?? course.level}
        </span>
      </div>

      <div className="p-5">
        <h3 className="line-clamp-2 font-display text-base font-semibold text-ink">
          {course.title}
        </h3>
        <p className="mt-1 truncate text-sm text-ink/60">
          {dict.course.by} {course.instructor?.name}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-sm font-semibold text-ink">
            {course.price > 0
              ? `${course.price} ${locale === "ar" ? "ج.م" : "EGP"}`
              : dict.course.free}
          </span>
          {course.ratingCount > 0 && (
            <span className="flex items-center gap-1 font-mono text-xs text-accent">
              ★ {course.ratingAvg.toFixed(1)}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
