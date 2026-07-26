import { apiFetch } from "./client";

export type Category = { _id: string; name: string; slug: string };

export function getCategories() {
  return apiFetch<{ status: string; data: Category[] }>("/categories?limit=100");
}
