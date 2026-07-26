import { apiFetch } from "./client";

export type DashboardEnrollment = {
  _id: string;
  course: { _id: string; title: string; thumbnailUrl?: string };
  progressPercent: number;
  status: "active" | "completed" | "dropped";
};

export type DashboardCertificate = {
  _id: string;
  course: { title: string };
  certificateUrl: string;
  issuedAt: string;
};

export type DashboardData = {
  profile: {
    bio: string;
    totalLearningHours: number;
    badges: unknown[];
  };
  stats: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    totalLearningHours: number;
    certificatesCount: number;
    badgesCount: number;
  };
  enrollments: DashboardEnrollment[];
  certificates: DashboardCertificate[];
};

export function getDashboard(token: string) {
  return apiFetch<{ status: string; data: DashboardData }>("/profile/me/dashboard", { token });
}
