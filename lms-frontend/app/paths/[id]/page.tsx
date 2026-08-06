"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { Navbar } from "@/components/Navbar";
import { CourseCard } from "@/components/CourseCard";
import { apiFetch } from "@/lib/api/client";
import type { Course } from "@/lib/api/courses";

type PathDetail = {
  _id: string;
  title: string;
  description: string;
  courses: Course[];
};

export default function PathDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [path, setPath] = useState<PathDetail | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    apiFetch<{ data: PathDetail }>(`/paths/${id}`)
      .then((res) => setPath(res.data))
      .catch(() => setError(true));
  }, [id]);

  if (error) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-4xl px-6 py-16 text-center text-sm text-ink/50">
          المسار غير موجود
        </main>
      </>
    );
  }

  if (!path) {
    return (
      <>
        <Navbar />
        <main className="mx-auto max-w-4xl px-6 py-16">
          <div className="h-6 w-1/3 animate-pulse rounded bg-line/40" />
        </main>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <main className="mx-auto max-w-4xl flex-1 px-6 py-10">
        <h1 className="font-display text-2xl font-bold text-ink">{path.title}</h1>
        {path.description && <p className="mt-2 text-sm text-ink/60">{path.description}</p>}

        <div className="mt-8 grid gap-6 sm:grid-cols-2">
          {(path.courses || []).filter(Boolean).map((c, i) => (
            <CourseCard key={c._id} course={c} index={i} />
          ))}
        </div>

        {(path.courses || []).length === 0 && (
          <p className="mt-6 text-sm text-ink/50">لا توجد كورسات في هذا المسار</p>
        )}

        <Link href="/paths" className="mt-8 inline-block text-sm text-primary hover:underline">
          ← كل المسارات
        </Link>
      </main>
    </>
  );
}
