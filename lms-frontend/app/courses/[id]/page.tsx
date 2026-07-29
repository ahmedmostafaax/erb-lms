"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { Navbar } from "@/components/Navbar";
import { Alert } from "@/components/Alert";
import { getCourse, type Course, type Review } from "@/lib/api/courses";
import { enrollCourse } from "@/lib/api/enrollments";
import { createReview } from "@/lib/api/reviews";
import { StarRating } from "@/components/StarRating";
import { ApiError } from "@/lib/api/client";

const levelLabels: Record<string, { ar: string; en: string }> = {
  beginner: { ar: "مبتدئ", en: "Beginner" },
  intermediate: { ar: "متوسط", en: "Intermediate" },
  advanced: { ar: "متقدم", en: "Advanced" },
};

export default function CourseDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const { dict, locale } = useLanguage();
  const { token } = useAuth();
  const router = useRouter();

  const [course, setCourse] = useState<Course | null>(null);
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [enrolling, setEnrolling] = useState(false);
  const [enrollError, setEnrollError] = useState<string | null>(null);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [reviewError, setReviewError] = useState<string | null>(null);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [submittingReview, setSubmittingReview] = useState(false);

  useEffect(() => {
    getCourse(id)
      .then((res) => {
        setCourse(res.data.course);
        setReviews(res.data.reviews);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  const handleEnroll = async () => {
    if (!course || !token) return;

    if (course.price > 0) {
      router.push(`/checkout/${course._id}`);
      return;
    }

    setEnrollError(null);
    setEnrolling(true);
    try {
      await enrollCourse(course._id, token);
      router.push("/dashboard");
    } catch (err) {
      setEnrollError(err instanceof ApiError ? err.message : "حدث خطأ، حاول تاني");
    } finally {
      setEnrolling(false);
    }
  };

  const handleSubmitReview = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!course || !token || reviewRating === 0) return;

    setReviewError(null);
    setSubmittingReview(true);
    try {
      await createReview({ courseId: course._id, rating: reviewRating, comment: reviewComment }, token);
      setReviewSuccess(true);
      setReviewRating(0);
      setReviewComment("");
      const refreshed = await getCourse(course._id);
      setReviews(refreshed.data.reviews);
    } catch (err) {
      setReviewError(err instanceof ApiError ? err.message : "حدث خطأ، حاول تاني");
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-4xl flex-1 px-6 py-16">
          <div className="h-8 w-2/3 animate-pulse rounded bg-line/40" />
          <div className="mt-4 h-4 w-1/3 animate-pulse rounded bg-line/40" />
        </main>
      </>
    );
  }

  if (notFound || !course) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-4xl flex-1 px-6 py-16 text-center">
          <p className="text-ink/60">{dict.courseDetails.notFound}</p>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="flex-1">
        <div
          className="flex h-64 items-end"
          style={
            course.thumbnailUrl
              ? {
                  backgroundImage: `url(${course.thumbnailUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                }
              : { background: "linear-gradient(135deg, var(--primary), var(--primary-dark))" }
          }
        >
          <div className="mx-auto w-full max-w-4xl px-6 pb-8">
            <span className="rounded-full bg-white/15 px-3 py-1 text-xs font-medium text-white backdrop-blur">
              {levelLabels[course.level]?.[locale] ?? course.level}
            </span>
            <h1 className="mt-3 font-display text-3xl font-bold text-white">{course.title}</h1>
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-6 py-10">
          <div className="grid gap-10 md:grid-cols-3">
            <div className="md:col-span-2">
              <h2 className="font-display text-lg font-semibold text-ink">
                {dict.courseDetails.about}
              </h2>
              <p className="mt-3 leading-relaxed text-ink/70">{course.description}</p>

              {course.gallery && course.gallery.length > 0 && (
                <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
                  {course.gallery.map((item) => (
                    <div key={item._id} className="overflow-hidden rounded-xl border border-line">
                      {item.type === "image" ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={item.url} alt="" className="h-28 w-full object-cover" />
                      ) : (
                        <video src={item.url} controls className="h-28 w-full object-cover" />
                      )}
                    </div>
                  ))}
                </div>
              )}

              <h2 className="mt-10 font-display text-lg font-semibold text-ink">
                {dict.courseDetails.instructor}
              </h2>
              <p className="mt-3 text-sm text-ink/70">{course.instructor?.name}</p>

              <h2 className="mt-10 font-display text-lg font-semibold text-ink">
                {dict.courseDetails.reviews} ({reviews.length})
              </h2>

              {token && (
                <form
                  onSubmit={handleSubmitReview}
                  className="mt-4 space-y-3 rounded-xl border border-line bg-paper-raised p-4"
                >
                  {reviewSuccess && <Alert type="success" message={dict.courseDetails.reviewSuccess} />}
                  {reviewError && <Alert type="error" message={reviewError} />}

                  <StarRating value={reviewRating} onChange={setReviewRating} />
                  <textarea
                    value={reviewComment}
                    onChange={(e) => setReviewComment(e.target.value)}
                    placeholder={dict.courseDetails.reviewPlaceholder}
                    rows={3}
                    className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
                  />
                  <button
                    type="submit"
                    disabled={reviewRating === 0 || submittingReview}
                    className="rounded-xl bg-primary px-5 py-2 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
                  >
                    {submittingReview ? dict.checkout.processing : dict.courseDetails.submitReview}
                  </button>
                </form>
              )}

              {reviews.length === 0 ? (
                <p className="mt-3 text-sm text-ink/50">{dict.courseDetails.noReviews}</p>
              ) : (
                <div className="mt-4 space-y-4">
                  {reviews.map((r) => (
                    <div key={r._id} className="rounded-xl border border-line bg-paper-raised p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium text-ink">{r.user.name}</span>
                        <span className="font-mono text-xs text-accent">★ {r.rating}</span>
                      </div>
                      {r.comment && <p className="mt-2 text-sm text-ink/70">{r.comment}</p>}
                    </div>
                  ))}
                </div>
              )}
            </div>

            <aside>
              <div className="rounded-2xl border border-line bg-paper-raised p-6">
                <div className="font-mono text-2xl font-bold text-ink">
                  {course.price > 0
                    ? `${course.price} ${locale === "ar" ? "ج.م" : "EGP"}`
                    : dict.course.free}
                </div>

                <button
                  onClick={handleEnroll}
                  disabled={!token || enrolling}
                  className="mt-5 w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-50"
                >
                  {enrolling ? "..." : dict.course.enroll}
                </button>

                {enrollError && (
                  <div className="mt-3">
                    <Alert type="error" message={enrollError} />
                  </div>
                )}

                {!token && (
                  <p className="mt-3 text-center text-xs text-ink/50">
                    {dict.courseDetails.loginToEnroll}
                  </p>
                )}

                <div className="mt-6 space-y-2 border-t border-line pt-6 text-sm text-ink/70">
                  <div className="flex justify-between">
                    <span>{dict.courseDetails.enrolledCount}</span>
                    <span className="font-mono">{course.enrollmentCount}</span>
                  </div>
                  {course.ratingCount > 0 && (
                    <div className="flex justify-between">
                      <span>{dict.courseDetails.rating}</span>
                      <span className="font-mono">
                        {course.ratingAvg.toFixed(1)} ({course.ratingCount})
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </aside>
          </div>
        </div>
      </main>
    </>
  );
}
