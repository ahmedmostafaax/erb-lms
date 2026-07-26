import { apiFetch } from "./client";

export type Certificate = {
  _id: string;
  user: { name: string };
  course: { title: string; instructor?: { name: string } };
  issuedAt: string;
};

export function getCertificate(id: string) {
  return apiFetch<{ status: string; data: Certificate }>(`/certificates/${id}`);
}
