import { apiFetch, apiUpload } from "./client";
import type { AuthUser } from "./auth";

export function updatePersonalData(
  payload: { name?: string; phone?: string },
  token: string
) {
  return apiFetch<{ status: string; data: AuthUser }>("/settings/personal-data", {
    method: "PUT",
    body: payload,
    token,
  });
}

export function changePassword(
  payload: { currentPassword: string; newPassword: string },
  token: string
) {
  return apiFetch<{ status: string; message: string }>("/settings/change-password", {
    method: "PUT",
    body: payload,
    token,
  });
}

export function uploadAvatar(file: File, token: string) {
  const formData = new FormData();
  formData.append("avatar", file);
  return apiUpload<{ status: string; data: { avatarUrl: string } }>(
    "/profile/me/avatar",
    formData,
    token
  );
}

export function uploadCv(file: File, token: string) {
  const formData = new FormData();
  formData.append("cv", file);
  return apiUpload<{ status: string; data: { cvUrl: string } }>("/profile/me/cv", formData, token);
}
