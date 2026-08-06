import type { Metadata } from "next";

const apiUrl =
  process.env.NEXT_PUBLIC_API_URL ||
  "http://ec2-63-184-39-37.eu-central-1.compute.amazonaws.com/api";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const res = await fetch(`${apiUrl}/courses/${id}`, { next: { revalidate: 300 } });
    if (!res.ok) return { title: "كورس" };
    const json = await res.json();
    const course = json.data?.course || json.data;
    return {
      title: course?.title || "كورس",
      description: course?.description?.slice(0, 160) || "تفاصيل الكورس",
      openGraph: {
        title: course?.title,
        description: course?.description?.slice(0, 160),
        images: course?.thumbnailUrl ? [course.thumbnailUrl] : [],
      },
    };
  } catch {
    return { title: "كورس" };
  }
}

export default function CourseLayout({ children }: { children: React.ReactNode }) {
  return children;
}
