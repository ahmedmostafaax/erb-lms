"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Alert } from "@/components/Alert";
import { ShareCourse } from "@/components/ShareCourse";
import { apiFetch, ApiError } from "@/lib/api/client";

type Lesson = { _id: string; title: string; durationSeconds?: number; order?: number };
type Module = { _id: string; title: string; order?: number; lessons?: Lesson[] };
type CourseDetail = {
  _id: string;
  title: string;
  description?: string;
  price: number;
  level?: string;
  language?: string;
  status?: string;
  ratingAvg?: number;
  ratingCount?: number;
  enrollmentCount?: number;
  thumbnailUrl?: string;
  modules?: Module[];
  instructor?: {
    _id: string;
    name: string;
    avatarUrl?: string;
    profile?: { bio?: string; experienceYears?: number };
  };
  category?: { _id: string; name: string };
};

export default function CourseDetailPage() {
  const { id } = useParams<{ id: string }>();
  const { dict, locale } = useLanguage();
  const { token, user } = useAuth();
  const router = useRouter();
  const [course, setCourse] = useState<CourseDetail | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);

  useEffect(() => {
    apiFetch<{ data: CourseDetail }>(`/courses/${id}`)
      .then((res) => setCourse(res.data))
      .catch((e) => setError(e instanceof ApiError ? e.message : "الكورس غير موجود"))
      .finally(() => setLoading(false));
  }, [id]);

  const totalLessons =
    course?.modules?.reduce((s, m) => s + (m.lessons?.length || 0), 0) || 0;

  const enroll = async () => {
    if (!token) {
      router.push("/login");
      return;
    }
    if (!course) return;
    if (course.price > 0) {
      router.push(`/checkout/${course._id}`);
      return;
    }
    setEnrolling(true);
    try {
      await apiFetch("/enrollments", {
        method: "POST",
        token,
        body: { courseId: course._id },
      });
      router.push(`/learn/${course._id}`);
    } catch (e) {
      setError(e instanceof ApiError ? e.message : "فشل التسجيل");
    } finally {
      setEnrolling(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-4xl px-6 py-16">
          <div className="h-8 w-1/2 animate-pulse rounded bg-line/40" />
          <div className="mt-4 h-40 animate-pulse rounded-2xl bg-line/30" />
        </main>
      </>
    );
  }

  if (error || !course) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-xl px-6 py-16">
          <Alert type="error" message={error || "غير موجود"} />
          <Link href="/courses" className="mt-4 inline-block text-primary hover:underline">
            {locale === "ar" ? "العودة للكورسات" : "Back to courses"}
          </Link>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl px-6 py-10">
        <div className="overflow-hidden rounded-2xl border border-line bg-paper-raised">
          {course.thumbnailUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={course.thumbnailUrl}
              alt={course.title}
              className="h-48 w-full object-cover sm:h-64"
            />
          ) : (
            <div className="flex h-40 items-center justify-center bg-primary/10 text-4xl">📚</div>
          )}
          <div className="p-6">
            <p className="text-xs text-ink/50">
              {course.category?.name || "—"} · {course.level || "—"} · ★{" "}
              {course.ratingAvg ?? 0} ({course.ratingCount ?? 0})
            </p>
            <h1 className="mt-2 font-display text-2xl font-bold text-ink">{course.title}</h1>
            <p className="mt-3 whitespace-pre-wrap text-sm text-ink/70">{course.description}</p>
            <p className="mt-4 font-mono text-lg font-semibold text-primary">
              {course.price === 0
                ? locale === "ar"
                  ? "مجاني"
                  : "Free"
                : `${course.price} ج.م`}
            </p>
            <p className="mt-1 text-xs text-ink/50">
              {totalLessons} {locale === "ar" ? "درس" : "lessons"} ·{" "}
              {course.enrollmentCount ?? 0} {locale === "ar" ? "طالب" : "students"}
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={enroll}
                disabled={enrolling}
                className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-white disabled:opacity-50"
              >
                {enrolling
                  ? "..."
                  : course.price > 0
                    ? locale === "ar"
                      ? "شراء / تسجيل"
                      : "Enroll"
                    : locale === "ar"
                      ? "ابدأ مجانًا"
                      : "Start free"}
              </button>
              {token && user?.role === "student" ? (
                <Link
                  href={`/learn/${course._id}`}
                  className="rounded-full border border-line px-5 py-2.5 text-sm"
                >
                  {locale === "ar" ? "الذهاب للتعلم" : "Go to learn"}
                </Link>
              ) : null}
              <ShareCourse courseId={course._id} title={course.title} />
            </div>
          </div>
        </div>

        {/* المدرّس */}
        {course.instructor ? (
          <section className="mt-8 rounded-2xl border border-line p-5">
            <h2 className="font-display text-lg font-semibold">
              {locale === "ar" ? "المدرّس" : "Instructor"}
            </h2>
            <Link
              href={`/instructors/${course.instructor._id}`}
              className="mt-3 flex items-center gap-3 hover:opacity-90"
            >
              {course.instructor.avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={course.instructor.avatarUrl}
                  alt=""
                  className="h-12 w-12 rounded-full object-cover"
                />
              ) : (
                <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/15 font-semibold text-primary">
                  {course.instructor.name?.charAt(0) || "?"}
                </span>
              )}
              <div>
                <p className="font-medium text-ink">{course.instructor.name}</p>
                <p className="text-xs text-ink/50">
                  {course.instructor.profile?.experienceYears
                    ? `${course.instructor.profile.experienceYears} ${locale === "ar" ? "سنة خبرة" : "yrs exp"}`
                    : locale === "ar"
                      ? "عرض الملف"
                      : "View profile"}
                </p>
              </div>
            </Link>
            {course.instructor.profile?.bio ? (
              <p className="mt-3 text-sm text-ink/70">{course.instructor.profile.bio}</p>
            ) : null}
          </section>
        ) : null}

        {/* المنهج */}
        <section className="mt-8">
          <h2 className="font-display text-lg font-semibold">
            {locale === "ar" ? "محتوى الكورس" : "Curriculum"}
          </h2>
          {!course.modules?.length ? (
            <p className="mt-4 rounded-xl border border-dashed border-line py-10 text-center text-sm text-ink/50">
              {locale === "ar" ? "لا يوجد محتوى منشور بعد" : "No content yet"}
            </p>
          ) : (
            <div className="mt-4 space-y-4">
              {course.modules
                .slice()
                .sort((a, b) => (a.order || 0) - (b.order || 0))
                .map((mod, mi) => (
                  <div key={mod._id || mi} className="rounded-xl border border-line overflow-hidden">
                    <div className="bg-paper-raised px-4 py-3 text-sm font-semibold">
                      {mod.title}
                      <span className="ms-2 text-xs font-normal text-ink/50">
                        {mod.lessons?.length || 0}{" "}
                        {locale === "ar" ? "درس" : "lessons"}
                      </span>
                    </div>
                    <ul className="divide-y divide-line">
                      {(mod.lessons || [])
                        .slice()
                        .sort((a, b) => (a.order || 0) - (b.order || 0))
                        .map((les, li) => (
                          <li
                            key={les._id || li}
                            className="flex items-center justify-between px-4 py-2.5 text-sm text-ink/80"
                          >
                            <span>
                              {li + 1}. {les.title}
                            </span>
                            {les.durationSeconds ? (
                              <span className="font-mono text-xs text-ink/40">
                                {Math.ceil(les.durationSeconds / 60)} {locale === "ar" ? "د" : "m"}
                              </span>
                            ) : null}
                          </li>
                        ))}
                    </ul>
                  </div>
                ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
