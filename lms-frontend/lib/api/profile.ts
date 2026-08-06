import { apiFetch } from "./client";

export type DashboardEnrollment = {
  _id: string;
  course: { _id: string; title: string; thumbnailUrl?: string };
  progressPercent: number;
  status: "active" | "completed" | "dropped";
  lastLessonId?: string;
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
    points?: number;
    badges: unknown[];
  };
  stats: {
    totalCourses: number;
    completedCourses: number;
    inProgressCourses: number;
    totalLearningHours: number;
    certificatesCount: number;
    badgesCount: number;
    points: number;
  };
  enrollments: DashboardEnrollment[];
  certificates: DashboardCertificate[];
};

export type MyProfile = {
  _id: string;
  name: string;
  email: string;
  role: string;
  phone?: string;
  age?: number;
  avatarUrl?: string;
  profile: {
    bio?: string;
    experienceYears?: number;
    education?: string;
    certifications?: string;
    specialties?: { _id: string; name?: string }[] | string[];
    points?: number;
  };
};

export function getDashboard(token: string) {
  return apiFetch<{ status: string; data: DashboardData }>("/profile/me/dashboard", { token });
}

export function getMyProfile(token: string) {
  return apiFetch<{ status: string; data: MyProfile }>("/profile/me", { token });
}

export function updateMyProfile(
  payload: {
    bio?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    specialties?: string[];
    experienceYears?: number;
    education?: string;
    certifications?: string;
    age?: number;
  },
  token: string
) {
  return apiFetch<{ status: string; data: unknown }>("/profile/me", {
    method: "PUT",
    body: payload,
    token,
  });
}
