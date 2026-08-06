"use client";

import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/lib/i18n/LanguageProvider";
import { useAuth } from "@/lib/auth/AuthContext";
import { Alert } from "@/components/Alert";
import { createQuiz, type QuestionInput } from "@/lib/api/instructorQuiz";
import { ApiError } from "@/lib/api/client";

const emptyQuestion = (): QuestionInput => ({
  text: "",
  type: "mcq",
  options: ["", ""],
  correctAnswer: "",
  points: 1,
});

export default function NewQuizPage() {
  const { id: courseId } = useParams<{ id: string }>();
  const { dict } = useLanguage();
  const { token } = useAuth();
  const router = useRouter();

  const [title, setTitle] = useState("");
  const [type, setType] = useState<"quiz" | "exam" | "task">("quiz");
  const [durationMinutes, setDurationMinutes] = useState("15");
  const [questions, setQuestions] = useState<QuestionInput[]>([emptyQuestion()]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const updateQuestion = (index: number, patch: Partial<QuestionInput>) => {
    setQuestions((qs) => qs.map((q, i) => (i === index ? { ...q, ...patch } : q)));
  };

  const updateOption = (qIndex: number, optIndex: number, value: string) => {
    setQuestions((qs) =>
      qs.map((q, i) =>
        i === qIndex ? { ...q, options: q.options?.map((o, j) => (j === optIndex ? value : o)) } : q
      )
    );
  };

  const addOption = (qIndex: number) => {
    setQuestions((qs) =>
      qs.map((q, i) => (i === qIndex ? { ...q, options: [...(q.options || []), ""] } : q))
    );
  };

  const addQuestion = () => setQuestions((qs) => [...qs, emptyQuestion()]);
  const removeQuestion = (index: number) => setQuestions((qs) => qs.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;

    setError(null);
    setLoading(true);
    try {
      await createQuiz(
        {
          courseId,
          title,
          type,
          durationMinutes: Number(durationMinutes),
          questions: questions.map((q) => ({
            ...q,
            options: q.type === "mcq" ? q.options?.filter((o) => o.trim()) : undefined,
            correctAnswer: q.type === "essay" || q.type === "upload" ? undefined : q.correctAnswer,
          })),
        },
        token
      );
      router.push(`/instructor/courses/${courseId}/manage`);
    } catch (err) {
      setError(err instanceof ApiError ? err.message : "حدث خطأ، حاول تاني");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="mx-auto max-w-2xl flex-1 px-6 py-10">
      <h1 className="font-display text-2xl font-bold text-ink">{dict.instructorQuiz.title}</h1>

      <form onSubmit={handleSubmit} className="mt-6 space-y-6">
        {error && <Alert type="error" message={error} />}

        <div className="space-y-3 rounded-2xl border border-line bg-paper-raised p-5">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder={dict.instructorQuiz.quizTitle}
            required
            className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary"
          />
          <div className="grid grid-cols-2 gap-3">
            <select
              value={type}
              onChange={(e) => setType(e.target.value as typeof type)}
              className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary"
            >
              <option value="quiz">{dict.instructorQuiz.typeQuiz}</option>
              <option value="exam">{dict.instructorQuiz.typeExam}</option>
              <option value="task">{dict.instructorQuiz.typeTask}</option>
            </select>
            <input
              type="number"
              value={durationMinutes}
              onChange={(e) => setDurationMinutes(e.target.value)}
              placeholder={dict.quiz.minutes}
              className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary"
            />
          </div>
        </div>

        {questions.map((q, qIndex) => (
          <div key={qIndex} className="space-y-3 rounded-2xl border border-line bg-paper-raised p-5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-ink">
                {dict.instructorQuiz.question} {qIndex + 1}
              </span>
              {questions.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeQuestion(qIndex)}
                  className="text-xs text-danger hover:underline"
                >
                  {dict.instructorQuiz.remove}
                </button>
              )}
            </div>

            <input
              value={q.text}
              onChange={(e) => updateQuestion(qIndex, { text: e.target.value })}
              placeholder={dict.instructorQuiz.questionText}
              required
              className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary"
            />

            <div className="grid grid-cols-2 gap-3">
              <select
                value={q.type}
                onChange={(e) =>
                  updateQuestion(qIndex, { type: e.target.value as QuestionInput["type"] })
                }
                className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="mcq">{dict.instructorQuiz.mcq}</option>
                <option value="truefalse">{dict.instructorQuiz.truefalse}</option>
                <option value="essay">{dict.instructorQuiz.essay}</option>
                <option value="upload">{dict.instructorQuiz.upload}</option>
              </select>
              <input
                type="number"
                min={1}
                value={q.points}
                onChange={(e) => updateQuestion(qIndex, { points: Number(e.target.value) })}
                placeholder={dict.instructorQuiz.points}
                className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary"
              />
            </div>

            {q.type === "mcq" && (
              <div className="space-y-2">
                {q.options?.map((opt, optIndex) => (
                  <input
                    key={optIndex}
                    value={opt}
                    onChange={(e) => updateOption(qIndex, optIndex, e.target.value)}
                    placeholder={`${dict.instructorQuiz.option} ${optIndex + 1}`}
                    className="w-full rounded-xl border border-line bg-paper px-4 py-2 text-sm outline-none focus:border-primary"
                  />
                ))}
                <button
                  type="button"
                  onClick={() => addOption(qIndex)}
                  className="text-xs text-primary hover:underline"
                >
                  + {dict.instructorQuiz.addOption}
                </button>
                <select
                  value={q.correctAnswer}
                  onChange={(e) => updateQuestion(qIndex, { correctAnswer: e.target.value })}
                  className="mt-2 w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary"
                >
                  <option value="">{dict.instructorQuiz.correctAnswer}</option>
                  {q.options?.filter((o) => o.trim()).map((opt) => (
                    <option key={opt} value={opt}>
                      {opt}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {q.type === "truefalse" && (
              <select
                value={q.correctAnswer}
                onChange={(e) => updateQuestion(qIndex, { correctAnswer: e.target.value })}
                className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm outline-none focus:border-primary"
              >
                <option value="">{dict.instructorQuiz.correctAnswer}</option>
                <option value="true">{dict.quiz.true}</option>
                <option value="false">{dict.quiz.false}</option>
              </select>
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addQuestion}
          className="w-full rounded-xl border border-dashed border-line py-3 text-sm font-medium text-ink/60 hover:border-primary hover:text-primary"
        >
          + {dict.instructorQuiz.addQuestion}
        </button>

        <button
          type="submit"
          disabled={loading}
          className="w-full rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-dark disabled:opacity-60"
        >
          {loading ? dict.checkout.processing : dict.instructorQuiz.createQuiz}
        </button>
      </form>
    </main>
  );
}
