import { apiFetch, apiUpload } from "./client";
import type { Course } from "./courses";

export function getMyCourses(token: string) {
  return apiFetch<{ status: string; results: number; data: Course[] }>("/courses/my", { token });
}

export function createCourse(formData: FormData, token: string) {
  return apiUpload<{ status: string; data: Course }>("/courses", formData, token, "POST");
}

export function updateCourse(id: string, payload: Record<string, unknown>, token: string) {
  return apiFetch<{ status: string; data: Course }>(`/courses/${id}`, {
    method: "PUT",
    body: payload,
    token,
  });
}

export type CourseModule = {
  _id: string;
  title: string;
  order: number;
  lessons: { _id: string; title: string; videoUrl?: string; order: number }[];
};

export function addModule(courseId: string, payload: { title: string; order: number }, token: string) {
  return apiFetch<{ status: string; data: CourseModule }>(`/courses/${courseId}/modules`, {
    method: "POST",
    body: payload,
    token,
  });
}

export function addLesson(courseId: string, moduleId: string, formData: FormData, token: string) {
  return apiUpload<{ status: string; data: unknown }>(
    `/courses/${courseId}/modules/${moduleId}/lessons`,
    formData,
    token,
    "POST"
  );
}
