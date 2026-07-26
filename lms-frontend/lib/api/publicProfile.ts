import { apiFetch } from "./client";

export type PublicProfile = {
  _id: string;
  name: string;
  avatarUrl?: string;
  role: string;
  profile: {
    bio?: string;
    linkedinUrl?: string;
    portfolioUrl?: string;
    badges: unknown[];
    skills: { name: string }[];
  };
};

export function getPublicProfile(id: string) {
  return apiFetch<{ status: string; data: PublicProfile }>(`/profile/${id}`);
}
