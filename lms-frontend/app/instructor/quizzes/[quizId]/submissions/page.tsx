"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { Alert } from "@/components/Alert";
import {
  getQuizForGrading,
  getQuizSubmissions,
  gradeSubmission,
  type SubmissionWithUser,
} from "@/lib/api/instructorGrading";
import type { Quiz } from "@/lib/api/quizzes";
import { ApiError } from "@/lib/api/client";

function GradingRow({
  submission,
  quiz,
  token,
  onGraded,
}: {
  submission: SubmissionWithUser;
  quiz: Quiz;
  token: string;
  onGraded: (updated: SubmissionWithUser) => void;
}) {
  const { dict } = useLanguage();
  const maxScore = quiz.questions.reduce((sum, q) => sum + q.points, 0);
  const [score, setScore] = useState(submission.result?.score ?? 0);
  const [feedback, setFeedback] = useState(submission.result?.feedback ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGrade = async () => {
    setError(null);
    setSaving(true);
    try {
      const res = await gradeSubmission(submission._id, { score, feedback }, token);
      onGraded(res.data);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "حدث خطأ");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="rounded-2xl border border-line bg-paper-raised p-5">
      <div className="flex items-center justify-between">
        <span className="text-sm font-semibold text-ink">{submission.user.name}</span>
        <span
          className={`rounded-full px-3 py-1 text-xs font-semibold ${
            submission.status === "graded" ? "bg-success-soft text-success" : "bg-accent-soft text-ink"
          }`}
        >
          {submission.status === "graded" ? dict.instructorGrading.graded : dict.instructorGrading.pending}
        </span>
      </div>

      <div className="mt-4 space-y-3 border-t border-line pt-4">
        {quiz.questions.map((q) => {
          const answer = submission.answers.find((a) => a.questionId === q._id);
          return (
            <div key={q._id} className="text-sm">
              <p className="font-medium text-ink">{q.text}</p>
              <p className="mt-1 text-ink/70">{answer?.answer || "—"}</p>
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-3">
          <Alert type="error" message={error} />
        </div>
      )}

      <div className="mt-4 flex items-end gap-3 border-t border-line pt-4">
        <div className="w-24">
          <label className="mb-1 block text-xs text-ink/60">
            {dict.instructorGrading.score} ({maxScore})
          </label>
          <input
            type="number"
            min={0}
            max={maxScore}
            value={score}
            onChange={(e) => setScore(Number(e.target.value))}
            className="w-full rounded-lg border border-line bg-paper px-3 py-1.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <div className="flex-1">
          <label className="mb-1 block text-xs text-ink/60">{dict.instructorGrading.feedback}</label>
          <input
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="w-full rounded-lg border border-line bg-paper px-3 py-1.5 text-sm outline-none focus:border-primary"
          />
        </div>
        <button
          onClick={handleGrade}
          disabled={saving}
          className="rounded-lg bg-primary px-4 py-1.5 text-sm font-semibold text-white hover:bg-primary-dark disabled:opacity-60"
        >
          {saving ? "..." : dict.instructorGrading.save}
        </button>
      </div>
    </div>
  );
}

export default function SubmissionsPage() {
  const { quizId } = useParams<{ quizId: string }>();
  const { dict } = useLanguage();
  const { token } = useAuth();

  const [quiz, setQuiz] = useState<Quiz | null>(null);
  const [submissions, setSubmissions] = useState<SubmissionWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    Promise.all([getQuizForGrading(quizId, token), getQuizSubmissions(quizId, token)])
      .then(([quizRes, subsRes]) => {
        setQuiz(quizRes.data);
        setSubmissions(subsRes.data);
      })
      .finally(() => setLoading(false));
  }, [quizId, token]);

  const handleGraded = (updated: SubmissionWithUser) => {
    setSubmissions((subs) => subs.map((s) => (s._id === updated._id ? updated : s)));
  };

  if (loading || !quiz) {
    return (
      <main className="mx-auto max-w-3xl flex-1 px-6 py-16">
        <div className="h-6 w-1/3 animate-pulse rounded bg-line/40" />
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl flex-1 px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">{quiz.title}</h1>
      <p className="mt-1 text-sm text-ink/60">
        {submissions.length} {dict.instructorGrading.submissionsCount}
      </p>

      <div className="mt-6 space-y-4">
        {submissions.length === 0 ? (
          <p className="py-8 text-center text-sm text-ink/50">{dict.instructorGrading.noSubmissions}</p>
        ) : (
          submissions.map((s) => (
            <GradingRow key={s._id} submission={s} quiz={quiz} token={token!} onGraded={handleGraded} />
          ))
        )}
      </div>
    </main>
  );
}
