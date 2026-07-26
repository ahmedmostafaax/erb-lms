import { apiFetch } from "./client";

export type Lesson = {
  _id: string;
  title: string;
  videoUrl?: string;
  durationSeconds: number;
  order: number;
  quizId?: string | null;
};

export type CourseModule = {
  _id: string;
  title: string;
  order: number;
  lessons: Lesson[];
};

export function getCourseContent(courseId: string, token: string) {
  return apiFetch<{ status: string; data: CourseModule[] }>(`/courses/${courseId}/content`, {
    token,
  });
}
