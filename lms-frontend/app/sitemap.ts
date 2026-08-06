import type { MetadataRoute } from "next";

const siteUrl =
  process.env.NEXT_PUBLIC_SITE_URL ||
  "http://ec2-63-184-39-37.eu-central-1.compute.amazonaws.com";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://ec2-63-184-39-37.eu-central-1.compute.amazonaws.com/api";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: "daily", priority: 1 },
    { url: `${siteUrl}/courses`, changeFrequency: "daily", priority: 0.9 },
    { url: `${siteUrl}/paths`, changeFrequency: "weekly", priority: 0.8 },
    { url: `${siteUrl}/search`, changeFrequency: "weekly", priority: 0.7 },
  ];

  try {
    const res = await fetch(`${apiUrl}/courses?limit=100`, { next: { revalidate: 3600 } });
    if (!res.ok) return staticPages;
    const json = await res.json();
    const courses = (json.data || []) as { _id: string; updatedAt?: string }[];
    const coursePages = courses.map((c) => ({
      url: `${siteUrl}/courses/${c._id}`,
      lastModified: c.updatedAt ? new Date(c.updatedAt) : new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.8,
    }));
    return [...staticPages, ...coursePages];
  } catch {
    return staticPages;
  }
}
