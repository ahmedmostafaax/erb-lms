import { apiFetch } from "./client";

export type QuizQuestion = {
  _id: string;
  text: string;
  type: "mcq" | "truefalse" | "essay" | "upload";
  options?: string[];
  points: number;
};

export type Quiz = {
  _id: string;
  title: string;
  type: "quiz" | "exam" | "task";
  durationMinutes?: number;
  questions: QuizQuestion[];
};

export type Submission = {
  _id: string;
  status: "submitted" | "graded";
  answers: { questionId: string; answer: string }[];
  result: { score: number; maxScore: number; feedback?: string } | null;
};

export function getQuiz(id: string, token: string) {
  return apiFetch<{ status: string; data: Quiz }>(`/quizzes/${id}`, { token });
}

export function submitQuiz(
  id: string,
  answers: { questionId: string; answer: string }[],
  token: string
) {
  return apiFetch<{ status: string; data: Submission }>(`/quizzes/${id}/submit`, {
    method: "POST",
    body: { answers },
    token,
  });
}

export function getMySubmission(id: string, token: string) {
  return apiFetch<{ status: string; data: Submission }>(`/quizzes/${id}/my-submission`, { token });
}
