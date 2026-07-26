"use client";

import { useEffect, useMemo, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Alert } from "@/components/Alert";
import { getCourseContent, type CourseModule, type Lesson } from "@/lib/api/learning";
import { getMyEnrollments, updateProgress, type Enrollment } from "@/lib/api/enrollments";
import { ApiError } from "@/lib/api/client";

function LearnContent() {
  const { courseId } = useParams<{ courseId: string }>();
  const { dict } = useLanguage();
  const { token } = useAuth();

  const [modules, setModules] = useState<CourseModule[]>([]);
  const [enrollment, setEnrollment] = useState<Enrollment | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [marking, setMarking] = useState(false);

  useEffect(() => {
    if (!token) return;

    Promise.all([getCourseContent(courseId, token), getMyEnrollments(token)])
      .then(([contentRes, enrollmentsRes]) => {
        setModules(contentRes.data);
        const found = enrollmentsRes.data.find((e) => e.course._id === courseId);
        setEnrollment(found || null);

        const firstLesson = contentRes.data[0]?.lessons?.[0];
        if (firstLesson) setActiveLesson(firstLesson);
      })
      .catch((err) => setError(err instanceof ApiError ? err.message : "لازم تكون مسجل في الكورس ده"))
      .finally(() => setLoading(false));
  }, [courseId, token]);

  const isCompleted = useMemo(
    () => (lessonId: string) => enrollment?.completedLessonIds.includes(lessonId) ?? false,
    [enrollment]
  );

  const handleMarkComplete = async () => {
    if (!enrollment || !activeLesson || !token) return;
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

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-6xl flex-1 px-6 py-16">
          <div className="h-6 w-1/3 animate-pulse rounded bg-line/40" />
        </main>
      </>
    );
  }

  if (error && !modules.length) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-2xl flex-1 px-6 py-16">
          <Alert type="error" message={error} />
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto grid max-w-6xl flex-1 gap-8 px-6 py-8 md:grid-cols-[1fr_320px]">
        <div>
          <div className="aspect-video overflow-hidden rounded-2xl bg-ink">
            {activeLesson?.videoUrl ? (
              <video key={activeLesson._id} src={activeLesson.videoUrl} controls className="h-full w-full" />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-white/50">
                {dict.learn.noVideo}
              </div>
            )}
          </div>

          <h1 className="mt-5 font-display text-xl font-bold text-ink">{activeLesson?.title}</h1>

          <Link
            href={`/community/${courseId}`}
            className="mt-2 inline-block text-sm text-primary hover:underline"
          >
            {dict.learn.discuss}
          </Link>

          {activeLesson?.quizId && (
            <Link
              href={`/quiz/${activeLesson.quizId}`}
              className="mt-2 ms-4 inline-block text-sm font-medium text-accent hover:underline"
            >
              {dict.learn.takeQuiz}
            </Link>
          )}

          {activeLesson?.quizId && (
            <Link
              href={`/quiz/${activeLesson.quizId}`}
              className="mt-2 ms-4 inline-block text-sm font-medium text-accent hover:underline"
            >
              {dict.learn.takeQuiz}
            </Link>
          )}

          {error && (
            <div className="mt-4">
              <Alert type="error" message={error} />
            </div>
          )}

          <button
            onClick={handleMarkComplete}
            disabled={!activeLesson || marking || (activeLesson && isCompleted(activeLesson._id))}
            className="mt-5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
          >
            {activeLesson && isCompleted(activeLesson._id)
              ? dict.learn.completed
              : marking
                ? dict.learn.marking
                : dict.learn.markComplete}
          </button>

          {enrollment && (
            <div className="mt-6">
              <div className="h-2 w-full overflow-hidden rounded-full bg-line">
                <div
                  className="h-full rounded-full bg-accent transition-all"
                  style={{ width: `${enrollment.progressPercent}%` }}
                />
              </div>
              <p className="mt-2 font-mono text-xs text-ink/50">
                {dict.course.progress}: {enrollment.progressPercent}%
              </p>
            </div>
          )}
        </div>

        <aside className="space-y-5">
          {modules.map((module) => (
            <div key={module._id}>
              <h3 className="mb-2 text-sm font-semibold text-ink">{module.title}</h3>
              <div className="space-y-1">
                {module.lessons.map((lesson) => (
                  <button
                    key={lesson._id}
                    onClick={() => setActiveLesson(lesson)}
                    className={`flex w-full items-center gap-2 rounded-lg px-3 py-2 text-start text-sm transition-colors ${
                      activeLesson?._id === lesson._id
                        ? "bg-primary/10 text-primary"
                        : "text-ink/70 hover:bg-paper-raised"
                    }`}
                  >
                    <span className="font-mono text-xs">
                      {isCompleted(lesson._id) ? "✓" : "○"}
                    </span>
                    <span className="truncate">{lesson.title}</span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </aside>
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
