"use client";

import { useState } from "react";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch } from "@/lib/api/client";
import type { Course } from "@/lib/api/courses";

const levelLabels: Record<string, { ar: string; en: string }> = {
  beginner: { ar: "مبتدئ", en: "Beginner" },
  intermediate: { ar: "متوسط", en: "Intermediate" },
  advanced: { ar: "متقدم", en: "Advanced" },
};

const palette = ["#1B6B5A", "#123F35", "#0E2420"];

export function CourseCard({
  course,
  index = 0,
  initiallyWished = false,
}: {
  course: Course;
  index?: number;
  initiallyWished?: boolean;
}) {
  const { locale, dict } = useLanguage();
  const { token, user } = useAuth();
  const color = palette[index % palette.length];
  const type = course.thumbnailType || "image";
  const [wished, setWished] = useState(initiallyWished);
  const [saving, setSaving] = useState(false);

  const handleWishlist = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!token || !user || saving) return;
    setSaving(true);
    try {
      if (wished) {
        await apiFetch(`/wishlist/${course._id}`, { method: "DELETE", token });
        setWished(false);
      } else {
        await apiFetch(`/wishlist/${course._id}`, { method: "POST", token });
        setWished(true);
      }
    } catch {
      // لو POST فشل لأن موجود → اعتبره wished
      if (!wished) setWished(true);
    } finally {
      setSaving(false);
    }
  };

  return (
    <Link
      href={`/courses/${course._id}`}
      className="group relative block overflow-hidden rounded-2xl border border-line bg-paper-raised transition-shadow hover:shadow-lg hover:shadow-ink/5"
    >
      <div className="relative h-32 overflow-hidden">
        {type === "video" && course.thumbnailUrl ? (
          <video
            src={course.thumbnailUrl}
            className="h-full w-full object-cover"
            muted
            playsInline
            preload="metadata"
          />
        ) : type === "file" && course.thumbnailUrl ? (
          <div className="flex h-full w-full items-center justify-center bg-ink/5">
            <span className="text-sm font-medium text-ink/60">
              {locale === "ar" ? "📄 ملف مرفق" : "📄 Attached file"}
            </span>
          </div>
        ) : course.thumbnailUrl ? (
          <div
            className="h-full w-full"
            style={{
              backgroundImage: `url(${course.thumbnailUrl})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
        ) : (
          <div
            className="h-full w-full"
            style={{ background: `linear-gradient(135deg, ${color}, var(--primary-dark))` }}
          />
        )}

        <span className="absolute bottom-3 start-3 rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
          {levelLabels[course.level]?.[locale] ?? course.level}
        </span>

        {user && (
          <button
            type="button"
            onClick={handleWishlist}
            disabled={saving}
            className="absolute top-3 end-3 rounded-full bg-white/90 px-2.5 py-1 text-sm shadow hover:bg-white disabled:opacity-50"
            title={wished ? (locale === "ar" ? "إزالة من المفضلة" : "Remove") : locale === "ar" ? "أضف للمفضلة" : "Wishlist"}
          >
            {wished ? "♥" : "♡"}
          </button>
        )}
      </div>

      <div className="p-5">
        <h3 className="line-clamp-2 font-display text-base font-semibold text-ink">{course.title}</h3>
        <p className="mt-1 truncate text-sm text-ink/60">
          {dict.course.by}{" "}
          {course.instructor?._id ? (
            <span
              role="link"
              tabIndex={0}
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                window.location.href = `/instructors/${course.instructor._id}`;
              }}
              className="hover:text-primary hover:underline"
            >
              {course.instructor?.name}
            </span>
          ) : (
            course.instructor?.name
          )}
        </p>

        <div className="mt-4 flex items-center justify-between">
          <span className="font-mono text-sm font-semibold text-ink">
            {course.price > 0
              ? `${course.price} ${locale === "ar" ? "ج.م" : "EGP"}`
              : dict.course.free}
          </span>
          <span className="flex items-center gap-1 font-mono text-xs text-accent">
            ★ {(course.ratingAvg ?? 0).toFixed(1)}
            <span className="text-ink/50">({course.ratingCount ?? 0})</span>
          </span>
        </div>
      </div>
    </Link>
  );
}
