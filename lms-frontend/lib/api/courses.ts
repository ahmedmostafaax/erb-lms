import { apiFetch } from "./client";

export type Course = {
  _id: string;
  title: string;
  description: string;
  instructor: { _id: string; name: string; avatarUrl?: string };
  category: { _id: string; name: string; slug: string };
  price: number;
  level: "beginner" | "intermediate" | "advanced";
  language: string;
  thumbnailUrl?: string;
  status?: "draft" | "published" | "archived";
  modules?: {
    _id: string;
    title: string;
    lessons: { _id: string; title: string; videoUrl?: string; quizId?: string | null }[];
  }[];
  ratingAvg: number;
  ratingCount: number;
  enrollmentCount: number;
};

export type Review = {
  _id: string;
  user: { name: string; avatarUrl?: string };
  rating: number;
  comment?: string;
  createdAt: string;
};

type CoursesResponse = { status: string; results: number; page: number; data: Course[] };
type CourseDetailsResponse = { status: string; data: { course: Course; reviews: Review[] } };

export function getCourses(params: Record<string, string | number | undefined> = {}) {
  const query = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== "") query.set(key, String(value));
  });
  const qs = query.toString();
  return apiFetch<CoursesResponse>(`/courses${qs ? `?${qs}` : ""}`);
}

export function getCourse(id: string) {
  return apiFetch<CourseDetailsResponse>(`/courses/${id}`);
}
