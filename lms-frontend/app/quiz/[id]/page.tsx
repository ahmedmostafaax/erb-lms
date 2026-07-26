"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { ProtectedRoute } from "@/lib/auth/ProtectedRoute";
import { Navbar } from "@/components/Navbar";
import { Alert } from "@/components/Alert";
import { getQuiz, submitQuiz, getMySubmission, type Quiz, type Submission } from "@/lib/api/quizzes";
import { ApiError } from "@/lib/api/client";

function QuizContent() {
  const { id } = useParams<{ id: string }>();
  const { dict } = useLanguage();
  const { token } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [submission, setSubmission] = useState<Submission | null>(null);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (!token) return;
    getQuiz(id, token)
      .then((res) => setQuiz(res.data))
      .catch((err) => setError(err instanceof ApiError ? err.message : "حدث خطأ"))
      .finally(() => setLoading(false));

    getMySubmission(id, token)
      .then((res) => setSubmission(res.data))
      .catch(() => {}); // طبيعي لو لسه ما سلّمش
  }, [id, token]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quiz || !token) return;

    const answersPayload = quiz.questions.map((q) => ({
      questionId: q._id,
      answer: answers[q._id] || "",
    }));

    setError(null);
    setSubmitting(true);
    try {
      const res = await submitQuiz(id, answersPayload, token);
      setSubmission(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "حدث خطأ، حاول تاني");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-2xl flex-1 px-6 py-16">
          <div className="h-6 w-1/2 animate-pulse rounded bg-line/40" />
        </main>
      </>
    );
  }

  if (error && !quiz) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-2xl flex-1 px-6 py-16">
          <Alert type="error" message={error} />
        </main>
      </>
    );
  }

  if (!quiz) return null;

  // لو سلّم قبل كده، اعرض النتيجة بدل الفورم
  if (submission) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-2xl flex-1 px-6 py-16">
          <h1 className="font-display text-2xl font-bold text-ink">{quiz.title}</h1>

          <div className="mt-6 rounded-2xl border border-line bg-paper-raised p-6 text-center">
            {submission.status === "graded" && submission.result ? (
              <>
                <p className="text-sm text-ink/60">{dict.quiz.yourScore}</p>
                <p className="mt-2 font-mono text-3xl font-bold text-primary">
                  {submission.result.score} / {submission.result.maxScore}
                </p>
                {submission.result.feedback && (
                  <p className="mt-4 text-sm text-ink/70">{submission.result.feedback}</p>
                )}
              </>
            ) : (
              <p className="text-sm text-ink/60">{dict.quiz.pendingGrading}</p>
            )}
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-2xl flex-1 px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-ink">{quiz.title}</h1>
        {quiz.durationMinutes && (
          <p className="mt-1 text-sm text-ink/50">
            {dict.quiz.duration}: {quiz.durationMinutes} {dict.quiz.minutes}
          </p>
        )}

        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
          {error && <Alert type="error" message={error} />}

          {quiz.questions.map((q, index) => (
            <div key={q._id} className="rounded-2xl border border-line bg-paper-raised p-5">
              <p className="text-sm font-medium text-ink">
                {index + 1}. {q.text}
              </p>

              {q.type === "mcq" && (
                <div className="mt-3 space-y-2">
                  {q.options?.map((opt) => (
                    <label key={opt} className="flex items-center gap-2 text-sm text-ink/80">
                      <input
                        type="radio"
                        name={q._id}
                        value={opt}
                        checked={answers[q._id] === opt}
                        onChange={(e) => setAnswers((a) => ({ ...a, [q._id]: e.target.value }))}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}

              {q.type === "truefalse" && (
                <div className="mt-3 flex gap-4">
                  {["true", "false"].map((val) => (
                    <label key={val} className="flex items-center gap-2 text-sm text-ink/80">
                      <input
                        type="radio"
                        name={q._id}
                        value={val}
                        checked={answers[q._id] === val}
                        onChange={(e) => setAnswers((a) => ({ ...a, [q._id]: e.target.value }))}
                      />
                      {val === "true" ? dict.quiz.true : dict.quiz.false}
                    </label>
                  ))}
                </div>
              )}

              {(q.type === "essay" || q.type === "upload") && (
                <textarea
                  value={answers[q._id] || ""}
                  onChange={(e) => setAnswers((a) => ({ ...a, [q._id]: e.target.value }))}
                  rows={4}
                  placeholder={q.type === "upload" ? dict.quiz.uploadHint : dict.quiz.essayPlaceholder}
                  className="mt-3 w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-ink outline-none focus:border-primary"
                />
              )}
            </div>
          ))}

          <button
            type="submit"
            disabled={submitting}
            className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
          >
            {submitting ? dict.checkout.processing : dict.quiz.submit}
          </button>
        </form>
      </main>
    </>
  );
}

export default function QuizPage() {
  return (
    <ProtectedRoute>
      <QuizContent />
    </ProtectedRoute>
  );
}
