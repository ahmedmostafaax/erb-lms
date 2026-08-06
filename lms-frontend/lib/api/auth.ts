import { apiFetch } from "./client";

export type AuthUser = {
  _id: string;
  name: string;
  email: string;
  role: "student" | "instructor" | "admin";
  avatarUrl?: string;
  isEmailVerified: boolean;
};

type AuthResponse = { status: string; token: string; data: AuthUser };
type MessageResponse = { status: string; message: string; data?: { email: string } };

export function signUp(payload: {
  name: string;
  email: string;
  password: string;
  role: "student" | "instructor";
  age?: number;
  experienceYears?: number;
  education?: string;
  certifications?: string;
  bio?: string;
}) {
  return apiFetch<MessageResponse>("/auth/signup", { method: "POST", body: payload });
}

export function signIn(payload: { email: string; password: string }) {
  return apiFetch<AuthResponse>("/auth/signin", { method: "POST", body: payload });
}

export function verifyEmail(payload: { email: string; otp: string }) {
  return apiFetch<AuthResponse>("/auth/verify-email", { method: "POST", body: payload });
}

export function resendOtp(payload: { email: string }) {
  return apiFetch<MessageResponse>("/auth/resend-otp", { method: "POST", body: payload });
}

export function forgotPassword(payload: { email: string }) {
  return apiFetch<MessageResponse>("/auth/forgot-password", { method: "POST", body: payload });
}

export function resetPassword(payload: { email: string; otp: string; newPassword: string }) {
  return apiFetch<MessageResponse>("/auth/reset-password", { method: "POST", body: payload });
}

export function googleAuth(payload: { idToken: string }) {
  return apiFetch<AuthResponse>("/auth/google", { method: "POST", body: payload });
}
