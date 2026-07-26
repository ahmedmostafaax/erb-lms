import { apiFetch } from "./client";

export function createReview(
  payload: { courseId: string; rating: number; comment?: string },
  token: string
) {
  return apiFetch<{ status: string; data: unknown }>("/reviews", {
    method: "POST",
    body: payload,
    token,
  });
}
