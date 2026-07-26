import { apiFetch } from "./client";

export type Enrollment = {
  _id: string;
  course: { _id: string; title: string };
  status: "active" | "completed" | "dropped";
  progressPercent: number;
  completedLessonIds: string[];
};

export function enrollCourse(courseId: string, token: string) {
  return apiFetch<{ status: string; data: unknown }>("/enrollments", {
    method: "POST",
    body: { courseId },
    token,
  });
}

export function getMyEnrollments(token: string) {
  return apiFetch<{ status: string; data: Enrollment[] }>("/enrollments/my", { token });
}

export function updateProgress(enrollmentId: string, lessonId: string, token: string) {
  return apiFetch<{ status: string; data: Enrollment }>(`/enrollments/${enrollmentId}/progress`, {
    method: "PATCH",
    body: { lessonId },
    token,
  });
}
