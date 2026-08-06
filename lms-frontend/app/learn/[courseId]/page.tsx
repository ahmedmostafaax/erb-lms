"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Alert } from "@/components/Alert";
import { getCourseContent, type CourseModule, type Lesson } from "@/lib/api/learning";
import { getMyEnrollments, updateProgress, type Enrollment } from "@/lib/api/enrollments";
import { apiFetch, ApiError } from "@/lib/api/client";

function LearnContent() {
  const { courseId } = useParams<{ courseId: string }>();
  const { dict, locale } = useLanguage();
  const { token } = useAuth();
  const videoRef = useRef<HTMLVideoElement>(null);

  const [modules, setModules] = useState<CourseModule[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [notes, setNotes] = useState("");
  const [focusMode, setFocusMode] = useState(false);
  const [watchedRatio, setWatchedRatio] = useState(0);

  const allLessons = useMemo(
    () => modules.flatMap((m) => m.lessons || []),
    [modules]
  );
  const lessonIndex = allLessons.findIndex((l) => l._id === activeLesson?._id);
  const watchedEnough = watchedRatio >= 0.95;
  const isCompletedLesson = (lessonId: string) =>
    enrollment?.completedLessonIds?.includes(lessonId) ?? false;
  const canGoNext =
    watchedEnough || (activeLesson ? isCompletedLesson(activeLesson._id) : false);

  const notesKey = `lesson-notes-${courseId}-${activeLesson?._id || "none"}`;
  const posKey = `lesson-pos-${courseId}-${activeLesson?._id || "none"}`;

  useEffect(() => {
    if (!token) return;
    Promise.all([getCourseContent(courseId, token), getMyEnrollments(token)])
      .then(([contentRes, enrollmentsRes]) => {
        setModules(contentRes.data);
        const found = enrollmentsRes.data.find((e) => e.course._id === courseId);
        setEnrollment(found || null);
        const lessons = contentRes.data.flatMap((m) => m.lessons || []);
        setActiveLesson(lessons[0] || null);
      })
      .catch((err) =>
        setError(err instanceof ApiError ? err.message : "لازم تكون مسجل في الكورس")
      )
      .finally(() => setLoading(false));
  }, [courseId, token]);

  useEffect(() => {
    setWatchedRatio(0);
    if (activeLesson) setNotes(localStorage.getItem(notesKey) || "");
  }, [activeLesson?._id, notesKey]);

  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = speed;
  }, [speed, activeLesson]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v || !activeLesson) return;
    const saved = Number(localStorage.getItem(posKey) || 0);
    const onLoaded = () => {
      if (saved > 0 && saved < (v.duration || Infinity) - 2) v.currentTime = saved;
    };
    const onTime = () => {
      if (v.duration > 0) {
        const ratio = v.currentTime / v.duration;
        setWatchedRatio((prev) => Math.max(prev, ratio));
        if (v.currentTime > 1) localStorage.setItem(posKey, String(v.currentTime));
      }
    };
    v.addEventListener("loadedmetadata", onLoaded);
    v.addEventListener("timeupdate", onTime);
    return () => {
      v.removeEventListener("loadedmetadata", onLoaded);
      v.removeEventListener("timeupdate", onTime);
    };
  }, [posKey, activeLesson]);

  const handleMarkComplete = async () => {
    if (!enrollment || !activeLesson || !token) return;
    if (!canGoNext) {
      setError(locale === "ar" ? "شاهد 95% من الفيديو أولًا" : "Watch 95% first");
      return;
    }
    setMarking(true);
    try {
      const res = await updateProgress(enrollment._id, activeLesson._id, token);
      setEnrollment(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "حصل خطأ");
    } finally {
      setMarking(false);
    }
  };

  const goPrev = () => {
    if (lessonIndex > 0) setActiveLesson(allLessons[lessonIndex - 1]);
  };

  const goNext = () => {
    if (!canGoNext) {
      setError(
        locale === "ar"
          ? "خلّص 95% من الفيديو الحالي قبل الدرس التالي"
          : "Finish 95% of this video first"
      );
      return;
    }
    if (lessonIndex >= 0 && lessonIndex < allLessons.length - 1) {
      setError(null);
      setActiveLesson(allLessons[lessonIndex + 1]);
    }
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "n" || e.key === "N") goNext();
      if (e.key === "p" || e.key === "P") goPrev();
      if (e.key === "f" || e.key === "F") setFocusMode((v) => !v);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  });

  const onVideoEnded = async () => {
    setWatchedRatio(1);
    await handleMarkComplete();
    if (lessonIndex < allLessons.length - 1) {
      setActiveLesson(allLessons[lessonIndex + 1]);
    }
  };

  if (loading) {
    return (
      <>
        {!focusMode ? <Navbar /> : null}
        <main className="mx-auto max-w-6xl px-6 py-16">
          <div className="h-6 w-1/3 animate-pulse rounded bg-line/40" />
        </main>
      </>
    );
  }

  if (error && !modules.length) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-2xl px-6 py-16">
          <Alert type="error" message={error} />
        </main>
      </>
    );
  }

  const mainClass = focusMode
    ? "mx-auto grid max-w-6xl flex-1 gap-8 px-6 py-8 md:grid-cols-1"
    : "mx-auto grid max-w-6xl flex-1 gap-8 px-6 py-8 md:grid-cols-[1fr_320px]";

  return (
    <>
      {!focusMode ? <Navbar /> : null}
      <main className={mainClass}>
        <div>
          {focusMode ? (
            <button
              type="button"
              onClick={() => setFocusMode(false)}
              className="mb-3 text-xs text-primary hover:underline"
            >
              {locale === "ar" ? "إظهار الشريط والقائمة" : "Exit focus"}
            </button>
          ) : null}

          <div className="aspect-video overflow-hidden rounded-2xl bg-ink">
            {activeLesson?.videoUrl ? (
              <video
                ref={videoRef}
                key={activeLesson._id}
                src={activeLesson.videoUrl}
                controls
                controlsList="nodownload"
                onEnded={onVideoEnded}
                className="h-full w-full"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-white/50">
                {dict.learn.noVideo}
              </div>
            )}
          </div>

          <p className="mt-2 text-xs text-ink/50">
            {locale === "ar" ? "مشاهدة الدرس:" : "Watched:"} {Math.round(watchedRatio * 100)}%
            {!canGoNext
              ? locale === "ar"
                ? " — لازم 95% عشان التالي"
                : " — need 95% for next"
              : ""}
          </p>

          <div className="mt-3 flex flex-wrap gap-2">
            {[0.75, 1, 1.25, 1.5, 2].map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setSpeed(s)}
                className={
                  speed === s
                    ? "rounded-full bg-primary px-2.5 py-1 text-xs text-white"
                    : "rounded-full border border-line px-2.5 py-1 text-xs"
                }
              >
                {s}x
              </button>
            ))}
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={goPrev}
              disabled={lessonIndex <= 0}
              className="rounded-full border border-line px-4 py-2 text-sm disabled:opacity-40"
            >
              {locale === "ar" ? "السابق" : "Prev"}
            </button>
            <button
              type="button"
              onClick={goNext}
              disabled={
                lessonIndex < 0 ||
                lessonIndex >= allLessons.length - 1 ||
                !canGoNext
              }
              className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-white disabled:opacity-40"
            >
              {locale === "ar" ? "التالي" : "Next"}
            </button>
            <button
              type="button"
              onClick={() => setFocusMode((v) => !v)}
              className="rounded-full border border-line px-4 py-2 text-sm"
            >
              {locale === "ar" ? "وضع التركيز" : "Focus"}
            </button>
          </div>

          <h1 className="mt-5 font-display text-xl font-bold">{activeLesson?.title}</h1>

          {error ? (
            <div className="mt-4">
              <Alert type="error" message={error} />
            </div>
          ) : null}

          <button
            type="button"
            onClick={handleMarkComplete}
            disabled={
              !activeLesson ||
              marking ||
              !canGoNext ||
              (activeLesson ? isCompletedLesson(activeLesson._id) : false)
            }
            className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
          >
            {activeLesson && isCompletedLesson(activeLesson._id)
              ? dict.learn.completed
              : marking
                ? dict.learn.marking
                : dict.learn.markComplete}
          </button>

          {enrollment ? (
            <div className="mt-6">
              <div className="h-2 w-full overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-accent"
                  style={{ width: `${enrollment.progressPercent}%` }}
                />
              </div>
              <p className="mt-2 font-mono text-xs text-ink/50">
                {enrollment.progressPercent}%
              </p>
            </div>
          ) : null}

          <div className="mt-8">
            <h3 className="text-sm font-semibold">
              {locale === "ar" ? "ملاحظات" : "Notes"}
            </h3>
            <textarea
              value={notes}
              onChange={(e) => {
                setNotes(e.target.value);
                if (activeLesson) localStorage.setItem(notesKey, e.target.value);
              }}
              rows={4}
              className="mt-2 w-full rounded-xl border border-line px-4 py-2.5 text-sm"
            />
          </div>
        </div>

        {!focusMode ? (
          <aside className="space-y-5">
            {modules.map((module) => (
              <div key={module._id}>
                <h3 className="mb-2 text-sm font-semibold">{module.title}</h3>
                <div className="space-y-1">
                  {(module.lessons || []).map((lesson, idx) => {
                    const globalIdx = allLessons.findIndex((l) => l._id === lesson._id);
                    const locked = Boolean(
                      globalIdx > lessonIndex &&
                      activeLesson &&
                      !isCompletedLesson(activeLesson._id) &&
                      !canGoNext &&
                      globalIdx === lessonIndex + 1
                    );
                    return (
                      <button
                        key={lesson._id}
                        type="button"
                        disabled={Boolean(locked)}
                        onClick={() => {
                          if (globalIdx > lessonIndex && !canGoNext && !isCompletedLesson(activeLesson?._id || "")) {
                            setError(
                              locale === "ar"
                                ? "خلّص 95% من الفيديو الحالي أولًا"
                                : "Finish 95% first"
                            );
                            return;
                          }
                          setError(null);
                          setActiveLesson(lesson);
                        }}
                        className={
                          activeLesson?._id === lesson._id
                            ? "flex w-full items-center gap-2 rounded-lg bg-primary/10 px-3 py-2 text-start text-sm text-primary"
                            : "flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm text-ink/70 hover:bg-paper-raised disabled:opacity-40"
                        }
                      >
                        <span className="font-mono text-xs">
                          {isCompletedLesson(lesson._id) ? "✓" : "○"}
                        </span>
                        <span className="truncate">{lesson.title}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </aside>
        ) : null}
      </main>
    </>
  );
}

export default function LearnPage() {
  return (
    <ProtectedRoute>
      <LearnContent />
    </ProtectedRoute>
  );
}
