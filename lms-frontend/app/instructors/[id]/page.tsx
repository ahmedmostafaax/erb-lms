"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { useAuth } from "@/lib/auth/AuthContext";
import { apiFetch, ApiError } from "@/lib/api/client";
import type { Course } from "@/lib/api/courses";
import { Alert } from "@/components/Alert";

type InstructorData = {
  instructor: {
    _id: string;
    name: string;
    avatarUrl?: string;
    profile?: {
      bio?: string;
      experienceYears?: number;
      education?: string;
      certifications?: string;
      points?: number;
    };
    createdAt?: string;
  };
  courses: Course[];
  stats: { coursesCount: number; studentsCount: number; avgRating: number };
};

type Review = {
  _id: string;
  rating: number;
  comment?: string;
  user: { name: string };
  createdAt: string;
};

export default function InstructorPublicPage() {
  const { id } = useParams<{ id: string }>();
  const { token, user } = useAuth();
  const [data, setData] = useState<InstructorData | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [avgRating, setAvgRating] = useState(0);
  const [notFound, setNotFound] = useState(false);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");
  const [msg, setMsg] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const load = () => {
    apiFetch<{ data: InstructorData }>(`/profile/instructors/${id}`)
      .then((res) => setData(res.data))
      .catch(() => setNotFound(true));

    apiFetch<{ data: Review[]; avgRating: number }>(`/instructor-reviews/${id}`)
      .then((res) => {
        setReviews(res.data);
        setAvgRating(res.avgRating || 0);
      })
      .catch(() => {});
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const submitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    setSaving(true);
    setMsg(null);
    try {
      await apiFetch(`/instructor-reviews/${id}`, {
        method: "POST",
        token,
        body: { rating, comment },
      });
      setMsg("تم حفظ تقييمك");
      setComment("");
      load();
    } catch (err) {
      setMsg(err instanceof ApiError ? err.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  if (notFound) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-3xl px-6 py-16 text-center text-sm text-ink/50">
          المدرّس غير موجود
        </main>
      </>
    );
  }

  if (!data) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-4xl px-6 py-16">
          <div className="h-8 w-1/3 animate-pulse rounded bg-line/40" />
        </main>
      </>
    );
  }

  const { instructor, courses, stats } = data;
  const p = instructor.profile || {};

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl flex-1 px-6 py-10">
        <div className="flex flex-wrap items-start gap-4">
          {instructor.avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={instructor.avatarUrl}
              alt={instructor.name}
              className="h-20 w-20 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10 text-2xl font-bold text-primary">
              {instructor.name?.charAt(0)}
            </div>
          )}
          <div className="flex-1">
            <h1 className="font-display text-2xl font-bold text-ink">{instructor.name}</h1>

        {token && (
          <button
            type="button"
            onClick={async () => {
              try {
                await apiFetch(`/instructor-favorites/${id}`, { method: "POST", token });
                setMsg("تمت الإضافة للمفضلة");
              } catch {
                setMsg("تعذر الإضافة");
              }
            }}
            className="mt-3 rounded-full border border-line px-3 py-1.5 text-xs"
          >
            أضف للمفضلة
          </button>
        )}

            {p.bio && <p className="mt-2 text-sm text-ink/70">{p.bio}</p>}
            <div className="mt-3 flex flex-wrap gap-3 text-xs text-ink/50">
              {p.experienceYears != null && <span>{p.experienceYears} سنة خبرة</span>}
              {p.education && <span>· {p.education}</span>}
              {p.certifications && <span>· {p.certifications}</span>}
            </div>
          </div>
        </div>

        <div className="mt-6 grid grid-cols-3 gap-3">
          <div className="rounded-xl border border-line p-3 text-center">
            <div className="font-mono text-xl font-semibold">{stats.coursesCount}</div>
            <div className="text-xs text-ink/50">كورسات</div>
          </div>
          <div className="rounded-xl border border-line p-3 text-center">
            <div className="font-mono text-xl font-semibold">{stats.studentsCount}</div>
            <div className="text-xs text-ink/50">طلاب</div>
          </div>
          <div className="rounded-xl border border-line p-3 text-center">
            <div className="font-mono text-xl font-semibold">
              ★ {(avgRating || stats.avgRating || 0).toFixed(1)}
            </div>
            <div className="text-xs text-ink/50">تقييم المدرّس</div>
          </div>
        </div>

        <section className="mt-10">
          <h2 className="font-display text-lg font-semibold text-ink">كورسات المدرّس</h2>
          {courses.length === 0 ? (
            <p className="mt-3 text-sm text-ink/50">لا توجد كورسات منشورة</p>
          ) : (
            <div className="mt-4 grid gap-6 sm:grid-cols-2">
              {courses.map((c, i) => (
                <CourseCard key={c._id} course={c} index={i} />
              ))}
            </div>
          )}
        </section>

        <section className="mt-12">
          <h2 className="font-display text-lg font-semibold text-ink">
            تقييمات المدرّس ({reviews.length})
          </h2>

          {token && user?._id !== instructor._id && (
            <form onSubmit={submitReview} className="mt-4 space-y-3 rounded-xl border border-line p-4">
              {msg && <Alert type="success" message={msg} />}
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((n) => (
                  <button
                    key={n}
                    type="button"
                    onClick={() => setRating(n)}
                    className={`h-9 w-9 rounded-full text-sm ${
                      rating >= n ? "bg-accent text-white" : "border border-line text-ink/50"
                    }`}
                  >
                    {n}
                  </button>
                ))}
              </div>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                rows={3}
                placeholder="تعليقك (اختياري)"
                className="w-full rounded-xl border border-line px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white disabled:opacity-50"
              >
                {saving ? "..." : "إرسال التقييم"}
              </button>
            </form>
          )}

          {!token && (
            <p className="mt-3 text-sm text-ink/50">
              <Link href="/login" className="text-primary hover:underline">
                سجّل دخول
              </Link>{" "}
              لتقييم المدرّس
            </p>
          )}

          <div className="mt-4 space-y-3">
            {reviews.map((r) => (
              <div key={r._id} className="rounded-xl border border-line bg-paper-raised p-4">
                <div className="flex justify-between text-sm">
                  <span className="font-medium">{r.user?.name}</span>
                  <span className="font-mono text-accent">★ {r.rating}</span>
                </div>
                {r.comment && <p className="mt-2 text-sm text-ink/70">{r.comment}</p>}
              </div>
            ))}
            {reviews.length === 0 && <p className="text-sm text-ink/50">لا توجد تقييمات بعد</p>}
          </div>
        </section>
      </main>
    </>
  );
}
