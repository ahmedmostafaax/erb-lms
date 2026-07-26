import { apiFetch } from "./client";

export type QuestionInput = {
  text: string;
  type: "mcq" | "truefalse" | "essay" | "upload";
  options?: string[];
  correctAnswer?: string;
  points: number;
};

export function createQuiz(
  payload: {
    courseId: string;
    lessonId?: string | null;
    title: string;
    type: "quiz" | "exam" | "task";
    durationMinutes?: number;
    questions: QuestionInput[];
  },
  token: string
) {
  return apiFetch<{ status: string; data: unknown }>("/quizzes", {
    method: "POST",
    body: payload,
    token,
  });
}
