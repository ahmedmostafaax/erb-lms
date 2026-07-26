import { apiFetch } from "./client";
import type { Quiz } from "./quizzes";

export type SubmissionWithUser = {
  _id: string;
  user: { name: string; avatarUrl?: string };
  answers: { questionId: string; answer: string }[];
  fileUrl?: string;
  status: "submitted" | "graded";
  result: { score: number; maxScore: number; feedback?: string } | null;
  createdAt: string;
};

export function getQuizForGrading(quizId: string, token: string) {
  return apiFetch<{ status: string; data: Quiz }>(`/quizzes/${quizId}`, { token });
}

export function getQuizSubmissions(quizId: string, token: string) {
  return apiFetch<{ status: string; results: number; data: SubmissionWithUser[] }>(
    `/quizzes/${quizId}/submissions`,
    { token }
  );
}

export function gradeSubmission(
  submissionId: string,
  payload: { score: number; feedback?: string },
  token: string
) {
  return apiFetch<{ status: string; data: SubmissionWithUser }>(
    `/quizzes/submissions/${submissionId}/grade`,
    { method: "PATCH", body: payload, token }
  );
}
