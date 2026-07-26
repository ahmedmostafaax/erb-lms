import { apiFetch } from "./client";

export type Notification = {
  _id: string;
  type: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
};

export function getMyNotifications(token: string) {
  return apiFetch<{ status: string; unreadCount: number; data: Notification[] }>(
    "/notifications?limit=10",
    { token }
  );
}

export function markAsRead(id: string, token: string) {
  return apiFetch<{ status: string }>(`/notifications/${id}/read`, { method: "PATCH", token });
}

export function markAllAsRead(token: string) {
  return apiFetch<{ status: string }>("/notifications/read-all", { method: "PATCH", token });
}
